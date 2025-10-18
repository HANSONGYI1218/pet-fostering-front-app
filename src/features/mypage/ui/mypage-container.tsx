import FetchErrorBox from '../common/fetch-error-box';
import LoginNoticeBox from '../common/login-notice-box';
import MypageContent from './mypage-content';
import { fetchMyComments, fetchMyNotificationSetting, fetchMyPosts, fetchMyProfile } from '@/lib/api/user';
import { mergeProfileWithClaims } from '@/features/mypage/lib/profile-fallback';
import { resolveServerAccessToken, resolveServerAuthClaims } from '@/lib/auth/server-session';
import type { MypageStep } from '@/features/mypage/lib/mypage-steps';
import { logError } from '@/shared/lib/logging';

const ERROR_MESSAGES = {
  unauthorized: '로그인이 필요합니다.',
  generic: '마이페이지 정보를 불러오지 못했습니다.',
} as const;

type MypageContainerProps = {
  initialStep: MypageStep;
};

export default async function MypageContainer({
  initialStep,
}: MypageContainerProps) {
  const accessToken = resolveServerAccessToken();
  const claims = resolveServerAuthClaims();

  if (!accessToken) {
    return <LoginNoticeBox errorMessage={ERROR_MESSAGES.unauthorized} />;
  }

  try {
    const [profileData, notificationData, postsData, commentsData] =
      await Promise.all([
        fetchMyProfile(accessToken),
        fetchMyNotificationSetting(accessToken),
        fetchMyPosts(accessToken),
        fetchMyComments(accessToken),
      ]);

    const profile = mergeProfileWithClaims(profileData, claims);

    return (
      <MypageContent
        initialStep={initialStep}
        profile={profile}
        notification={notificationData}
        posts={postsData}
        comments={commentsData}
      />
    );
  } catch (error) {
    const status = (error as { status?: number }).status;

    if (status === 401) {
      return <LoginNoticeBox errorMessage={ERROR_MESSAGES.unauthorized} />;
    }

    logError('마이페이지 데이터를 불러오지 못했습니다.', error);

    return <FetchErrorBox errorMessage={ERROR_MESSAGES.generic} />;
  }
}
