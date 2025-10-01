import { KakaoLogoutHandler } from '@/components/auth/kakao-logout-handler';

type SearchParams = Record<string, string | string[] | undefined>;

type KakaoLogoutCallbackPageProps = {
  searchParams: Promise<SearchParams>;
};

const KakaoLogoutCallbackPage = async ({
  searchParams,
}: KakaoLogoutCallbackPageProps) => {
  await (searchParams ?? Promise.resolve({}));

  return <KakaoLogoutHandler />;
};

export default KakaoLogoutCallbackPage;
