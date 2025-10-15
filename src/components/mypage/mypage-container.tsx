'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import MypageMeue from './mypage-menu';
import ProfileTab from './profile-tab';
import FosterTab from './foster-tab';
import RecordTab from './record-tab';
import SettingTab from './setting-tab';
import { Card } from '../ui/card';
import { type MypageStep, isMypageStep } from './mypage-steps';
import {
  fetchMyComments,
  fetchMyNotificationSetting,
  fetchMyPosts,
  fetchMyProfile,
} from '@/lib/api/user';
import {
  resolveStoredAccessToken,
  resolveStoredAuthClaims,
} from '@/lib/auth/session';
import type {
  UserProfileItem,
  UserNotificationSettingItem,
} from '@/types/user/user-api';
import type { PostItemByUserId } from '@/types/post/post-api';
import type { CommentItemByUserId } from '@/types/comment/comment-api';
import { mergeProfileWithClaims } from './profile-fallback';
import { tryRefreshAuthTokens } from '@/lib/auth/refresh';
import { Button } from '../ui/button';
import Link from 'next/link';
import LoginNoticeBox from '../common/login-notice-box';
import FetchErrorBox from '../common/fetch-error-box';

const ERROR_MESSAGES = {
  unauthorized: '로그인이 필요합니다.',
  generic: '마이페이지 정보를 불러오지 못했습니다.',
} as const;

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

export default function MypageContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const [currentStep, setCurrentStep] = useState<MypageStep>(() => {
    const params = new URLSearchParams(searchParamsString);
    const tabParam = params.get('tab');

    if (isMypageStep(tabParam)) {
      return tabParam;
    }

    return 'profile';
  });
  const [profile, setProfile] = useState<UserProfileItem | null>(() =>
    mergeProfileWithClaims(null, resolveStoredAuthClaims()),
  );
  const [notification, setNotification] =
    useState<UserNotificationSettingItem | null>(null);
  const [posts, setPosts] = useState<PostItemByUserId[]>([]);
  const [comments, setComments] = useState<CommentItemByUserId[]>([]);
  const [status, setStatus] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (allowRefresh: boolean) => {
      const token = resolveStoredAccessToken();

      if (!token) {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage(ERROR_MESSAGES.unauthorized);
        }
        return;
      }

      if (!cancelled) {
        setStatus('loading');
        setErrorMessage(null);
      }

      try {
        const [profileData, notificationData, postsData, commentsData] =
          await Promise.all([
            fetchMyProfile(token),
            fetchMyNotificationSetting(token),
            fetchMyPosts(token),
            fetchMyComments(token),
          ]);

        if (cancelled) {
          return;
        }

        const latestClaims = resolveStoredAuthClaims();
        setProfile(mergeProfileWithClaims(profileData, latestClaims));
        setNotification(notificationData);
        setPosts(postsData);
        setComments(commentsData);
        setStatus('loaded');
      } catch (error) {
        const statusCode = (error as { status?: number }).status;

        if (statusCode === 401 && allowRefresh) {
          const refreshed = await tryRefreshAuthTokens();

          if (refreshed) {
            if (cancelled) {
              return;
            }

            setProfile((prev) =>
              mergeProfileWithClaims(prev, resolveStoredAuthClaims()),
            );
            await load(false);
            return;
          }
        }

        if (!cancelled) {
          setErrorMessage(
            statusCode === 401
              ? ERROR_MESSAGES.unauthorized
              : ERROR_MESSAGES.generic,
          );
          setStatus('error');
        }
      }
    };

    void load(true);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const tabParam = params.get('tab');

    if (!isMypageStep(tabParam)) {
      if (tabParam) {
        params.delete('tab');
        const queryString = params.toString();
        const target = queryString ? `${pathname}?${queryString}` : pathname;
        router.replace(target, { scroll: false });
      }
      setCurrentStep((prev) => (prev === 'profile' ? prev : 'profile'));
      return;
    }

    setCurrentStep((prev) => (prev === tabParam ? prev : tabParam));
  }, [pathname, router, searchParamsString]);

  const handleProfileUpdate = useCallback((next: UserProfileItem) => {
    setProfile(mergeProfileWithClaims(next, resolveStoredAuthClaims()));
  }, []);

  const handleNotificationUpdate = useCallback(
    (next: UserNotificationSettingItem) => {
      setNotification(next);
    },
    [],
  );

  const updateTabQuery = useCallback(
    (next: MypageStep) => {
      const params = new URLSearchParams(searchParamsString);

      if (next === 'profile') {
        params.delete('tab');
      } else {
        params.set('tab', next);
      }

      const queryString = params.toString();
      const target = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(target, { scroll: false });
    },
    [pathname, router, searchParamsString],
  );

  const handleStepChange = useCallback(
    (next: MypageStep) => {
      if (next === currentStep) {
        return;
      }

      setCurrentStep(next);
      updateTabQuery(next);
    },
    [currentStep, updateTabQuery],
  );

  const content = useMemo(() => {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="flex w-full justify-center py-16 text-neutral-500">
          정보를 불러오는 중입니다...
        </div>
      );
    }

    if (status === 'error') {
      return errorMessage === '로그인이 필요합니다.' ? (
        <LoginNoticeBox errorMessage={errorMessage} />
      ) : (
        <FetchErrorBox errorMessage={errorMessage} />
      );
    }

    return (
      <div className="flex w-full flex-1">
        {currentStep === 'profile' && (
          <ProfileTab
            profile={profile}
            loading={status !== 'loaded'}
            onProfileUpdate={handleProfileUpdate}
          />
        )}
        {currentStep === 'foster' && <FosterTab />}
        {currentStep === 'record' && (
          <RecordTab
            posts={posts}
            comments={comments}
            loading={status !== 'loaded'}
          />
        )}
        {currentStep === 'setting' && (
          <SettingTab
            settings={notification}
            loading={status !== 'loaded'}
            onSettingsUpdate={handleNotificationUpdate}
          />
        )}
      </div>
    );
  }, [
    currentStep,
    comments,
    errorMessage,
    handleNotificationUpdate,
    handleProfileUpdate,
    notification,
    posts,
    profile,
    status,
  ]);

  return (
    <div className="flex w-full gap-10">
      <MypageMeue currentStep={currentStep} setCurrentStep={handleStepChange} />
      {content}
    </div>
  );
}
