'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import MypageMenu from './mypage-menu';
import ProfileTab from './profile-tab';
import FosterTab from './foster-tab';
import RecordTab from './record-tab';
import SettingTab from './setting-tab';
import {
  isMypageStep,
  type MypageStep,
} from '@/features/mypage/lib/mypage-steps';
import type {
  UserProfileItem,
  UserNotificationSettingItem,
} from '@/entities/user/user-api';
import type { PostItemByUserId } from '@/entities/post/post-api';
import type { CommentItemByUserId } from '@/entities/comment/comment-api';
import { mergeProfileWithClaims } from '@/features/mypage/lib/profile-fallback';
import { resolveStoredAuthClaims } from '@/lib/auth/session';

type MypageContentProps = {
  initialStep: MypageStep;
  profile: UserProfileItem | null;
  notification: UserNotificationSettingItem | null;
  posts: PostItemByUserId[];
  comments: CommentItemByUserId[];
};

export default function MypageContent({
  initialStep,
  profile,
  notification,
  posts,
  comments,
}: MypageContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paramsString = searchParams?.toString() ?? '';
  const tabParam = searchParams?.get('tab');
  const currentStep = isMypageStep(tabParam) ? tabParam : initialStep;
  const [profileState, setProfileState] = useState<UserProfileItem | null>(
    profile,
  );
  const [notificationState, setNotificationState] =
    useState<UserNotificationSettingItem | null>(notification);
  const [postsState] = useState<PostItemByUserId[]>(posts);
  const [commentsState] = useState<CommentItemByUserId[]>(comments);

  useEffect(() => {
    if (!tabParam || isMypageStep(tabParam)) {
      return;
    }

    const params = paramsString
      ? new URLSearchParams(paramsString)
      : new URLSearchParams();
    params.delete('tab');
    const queryString = params.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }, [tabParam, paramsString, pathname, router]);

  const updateTabQuery = useCallback(
    (next: MypageStep) => {
      const params = paramsString
        ? new URLSearchParams(paramsString)
        : new URLSearchParams();

      if (next === 'profile') {
        params.delete('tab');
      } else {
        params.set('tab', next);
      }

      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [paramsString, pathname, router],
  );

  const handleStepChange = useCallback(
    (next: MypageStep) => {
      if (next === currentStep) {
        return;
      }

      updateTabQuery(next);
    },
    [currentStep, updateTabQuery],
  );

  const handleProfileUpdate = useCallback((next: UserProfileItem) => {
    setProfileState(mergeProfileWithClaims(next, resolveStoredAuthClaims()));
  }, []);

  const handleNotificationUpdate = useCallback(
    (next: UserNotificationSettingItem) => {
      setNotificationState(next);
    },
    [],
  );

  const content = useMemo(() => {
    if (currentStep === 'profile') {
      return (
        <ProfileTab
          profile={profileState}
          loading={false}
          onProfileUpdate={handleProfileUpdate}
        />
      );
    }

    if (currentStep === 'foster') {
      return <FosterTab />;
    }

    if (currentStep === 'record') {
      return (
        <RecordTab
          posts={postsState}
          comments={commentsState}
          loading={false}
        />
      );
    }

    return (
      <SettingTab
        settings={notificationState}
        loading={false}
        onSettingsUpdate={handleNotificationUpdate}
      />
    );
  }, [
    commentsState,
    currentStep,
    handleNotificationUpdate,
    handleProfileUpdate,
    notificationState,
    postsState,
    profileState,
  ]);

  return (
    <div className="flex w-full gap-10">
      <MypageMenu currentStep={currentStep} setCurrentStep={handleStepChange} />
      <div className="flex w-full flex-1">{content}</div>
    </div>
  );
}
