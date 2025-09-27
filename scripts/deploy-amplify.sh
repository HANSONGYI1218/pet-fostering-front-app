#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
AMPLIFY_DIR="${ROOT_DIR}/deployment/amplify"
ENV_FILE="${ENV_FILE:-${AMPLIFY_DIR}/env.local}"

AWS_PROFILE="${AWS_PROFILE:-ROSITECH-MUNA}"
AWS_REGION="${AWS_REGION:-ap-northeast-2}"
AMPLIFY_APP_NAME="${AMPLIFY_APP_NAME:-pet-fostering-front-app}"
AMPLIFY_BRANCH="${AMPLIFY_BRANCH:-main}"
AMPLIFY_REPOSITORY="${AMPLIFY_REPOSITORY:-https://github.com/rositech-company/pet-fostering-front-app.git}"
AMPLIFY_PLATFORM="${AMPLIFY_PLATFORM:-WEB_COMPUTE}"
AMPLIFY_COMPUTE_ROLE_ARN="${AMPLIFY_COMPUTE_ROLE_ARN:-}"
BUILD_SPEC_PATH="${BUILD_SPEC_PATH:-${AMPLIFY_DIR}/amplify.yml}"

REQUIRED_BINARIES=(aws)

for bin in "${REQUIRED_BINARIES[@]}"; do
  if ! command -v "$bin" >/dev/null 2>&1; then
    echo "필수 명령어 '$bin' 을(를) 찾을 수 없습니다." >&2
    exit 1
  fi
done

if [[ ! -f "$BUILD_SPEC_PATH" ]]; then
  echo "build spec 파일을 찾을 수 없습니다: $BUILD_SPEC_PATH" >&2
  exit 1
fi

parse_env_file() {
  local file_path="$1"
  if [[ ! -f "$file_path" ]]; then
    echo "" && return
  fi

  local kv_pairs=()
  while IFS='=' read -r raw_key raw_value; do
    # 공백과 주석 제거
    [[ -z "$raw_key" || "$raw_key" =~ ^\s*# ]] && continue
    local key="$(echo "$raw_key" | xargs)"
    local value="$(echo "${raw_value-}" | xargs)"
    [[ -z "$key" ]] && continue
    kv_pairs+=("${key}=${value}")
  done <"$file_path"

  (IFS=','; echo "${kv_pairs[*]-}")
}

get_app_id() {
  aws amplify list-apps \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --query "apps[?name=='${AMPLIFY_APP_NAME}'].appId | [0]" \
    --output text
}

ensure_app() {
  local app_id
  app_id=$(get_app_id)

  if [[ "$app_id" != "None" && -n "$app_id" ]]; then
    echo "$app_id"
    return
  fi

  if [[ -z "${GITHUB_ACCESS_TOKEN:-}" ]]; then
    echo "앱 생성에는 GITHUB_ACCESS_TOKEN 환경 변수가 필요합니다." >&2
    exit 1
  fi

  local create_args=(
    --name "$AMPLIFY_APP_NAME"
    --region "$AWS_REGION"
    --profile "$AWS_PROFILE"
    --platform "$AMPLIFY_PLATFORM"
    --repository "$AMPLIFY_REPOSITORY"
    --access-token "$GITHUB_ACCESS_TOKEN"
    --build-spec "file://${BUILD_SPEC_PATH}"
  )

  if [[ -n "$AMPLIFY_COMPUTE_ROLE_ARN" ]]; then
    create_args+=(--compute-role-arn "$AMPLIFY_COMPUTE_ROLE_ARN")
  fi

  local new_app_id
  new_app_id=$(aws amplify create-app "${create_args[@]}" \
    --query 'app.appId' --output text)
  echo "$new_app_id"
}

ensure_branch() {
  local app_id="$1"
  local env_vars_csv="$2"

  local branch_exists
  branch_exists=$(aws amplify get-branch \
    --app-id "$app_id" \
    --branch-name "$AMPLIFY_BRANCH" \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --query 'branch.branchName' \
    --output text 2>/dev/null || true)

  local branch_args=(
    --app-id "$app_id"
    --branch-name "$AMPLIFY_BRANCH"
    --profile "$AWS_PROFILE"
    --region "$AWS_REGION"
    --stage PRODUCTION
    --framework NEXTJS
    --enable-auto-build
  )

  if [[ -n "$AMPLIFY_COMPUTE_ROLE_ARN" ]]; then
    branch_args+=(--compute-role-arn "$AMPLIFY_COMPUTE_ROLE_ARN")
  fi

  if [[ -n "$env_vars_csv" ]]; then
    branch_args+=(--environment-variables "$env_vars_csv")
  fi

  if [[ "$branch_exists" != "None" && -n "$branch_exists" ]]; then
    aws amplify update-branch "${branch_args[@]}" >/dev/null
  else
    aws amplify create-branch "${branch_args[@]}" >/dev/null
  fi
}

start_deploy() {
  local app_id="$1"
  aws amplify start-job \
    --app-id "$app_id" \
    --branch-name "$AMPLIFY_BRANCH" \
    --job-type RELEASE \
    --profile "$AWS_PROFILE" \
    --region "$AWS_REGION" \
    --output json
}

main() {
  local env_vars_csv
  env_vars_csv=$(parse_env_file "$ENV_FILE")

  if [[ -z "$env_vars_csv" ]]; then
    echo "경고: 환경 변수 파일(${ENV_FILE})을 찾지 못했거나 비어 있습니다." >&2
    echo "Amplify 환경 변수가 필요한 경우 파일을 생성 후 다시 실행하세요." >&2
  fi

  local app_id
  app_id=$(ensure_app)
  echo "Amplify 앱 ID: ${app_id}"

  ensure_branch "$app_id" "$env_vars_csv"
  echo "브랜치 '${AMPLIFY_BRANCH}' 구성 완료"

  local job_response
  job_response=$(start_deploy "$app_id")
  echo "$job_response"
  echo "배포 Job 이 시작되었습니다. Amplify 콘솔에서 진행 상황을 확인하세요."
}

main "$@"
