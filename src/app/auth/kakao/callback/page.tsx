import { KakaoCallbackHandler } from '@/components/auth/kakao-callback-handler';

type SearchParams = Record<string, string | string[] | undefined>;

type KakaoCallbackPageProps = {
  searchParams: Promise<SearchParams>;
};

const extractCodeParam = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export default async function KakaoCallbackPage({
  searchParams,
}: KakaoCallbackPageProps) {
  const resolvedSearchParams = await (searchParams ?? Promise.resolve({}));
  const code = extractCodeParam(resolvedSearchParams?.code);

  return <KakaoCallbackHandler code={code} />;
}
