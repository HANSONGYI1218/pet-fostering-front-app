import { KakaoCallbackHandler } from '@/components/auth/kakao-callback-handler';

type KakaoCallbackPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

const extractCodeParam = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export default function KakaoCallbackPage({
  searchParams,
}: KakaoCallbackPageProps) {
  const code = extractCodeParam(searchParams?.code);

  return <KakaoCallbackHandler code={code} />;
}
