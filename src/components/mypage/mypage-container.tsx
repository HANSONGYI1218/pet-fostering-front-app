'use client';

import { useEffect, useMemo, useState } from 'react';

import MypageMeue from './mypage-menu';
import ProfileTab from './profile-tab';
import FosterTab from './foster-tab';
import RecordTab from './record-tab';
import SettingTab from './setting-tab';
import { Card } from '../ui/card';
import {
  fetchMyComments,
  fetchMyNotificationSetting,
  fetchMyPosts,
  fetchMyProfile,
} from '@/lib/api/user';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import type { UserProfileItem, UserNotificationSettingItem } from '@/types/user/user-api';
import type { PostItemByUserId } from '@/types/post/post-api';
import type { CommentItemByUserId } from '@/types/comment/comment-api';

const ERROR_MESSAGES = {
  unauthorized: '로그인이 필요합니다. 다시 로그인해주세요.',
  generic: '마이페이지 정보를 불러오지 못했습니다.',
} as const;

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

export default function MypageContainer() {
  const [currentStep, setCurrentStep] = useState<string>('profile');
  const [profile, setProfile] = useState<UserProfileItem | null>(null);
  const [notification, setNotification] =
    useState<UserNotificationSettingItem | null>(null);
  const [posts, setPosts] = useState<PostItemByUserId[]>([]);
  const [comments, setComments] = useState<CommentItemByUserId[]>([]);
  const [status, setStatus] = useState<LoadState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = resolveStoredAccessToken();

    if (!token) {
      setStatus('error');
      setErrorMessage(ERROR_MESSAGES.unauthorized);
      return;
    }

    setStatus('loading');

    const load = async () => {
      try {
        const [profileData, notificationData, postsData, commentsData] =
          await Promise.all([
            fetchMyProfile(token),
            fetchMyNotificationSetting(token),
            fetchMyPosts(token),
            fetchMyComments(token),
          ]);

        setProfile(profileData);
        setNotification(notificationData);
        setPosts(postsData);
        setComments(commentsData);
        setStatus('loaded');
      } catch (error) {
        const statusCode = (error as { status?: number }).status;
        setErrorMessage(
          statusCode === 401 ? ERROR_MESSAGES.unauthorized : ERROR_MESSAGES.generic,
        );
        setStatus('error');
      }
    };

    void load();
  }, []);

  const content = useMemo(() => {
    if (status === 'loading' || status === 'idle') {
      return (
        <div className="flex w-full justify-center py-16 text-neutral-500">
          정보를 불러오는 중입니다...
        </div>
      );
    }

    if (status === 'error') {
      return (
        <Card className="flex h-48 w-full items-center justify-center text-neutral-500">
          {errorMessage}
        </Card>
      );
    }

    return (
      <div className="flex w-full flex-1">
        {currentStep === 'profile' && (
          <ProfileTab profile={profile} loading={status !== 'loaded'} />
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
          <SettingTab settings={notification} loading={status !== 'loaded'} />
        )}
      </div>
    );
  }, [comments, currentStep, errorMessage, notification, posts, profile, status]);

  return (
    <div className="flex w-full gap-10">
      <MypageMeue currentStep={currentStep} setCurrentStep={setCurrentStep} />
      {content}
    </div>
  );
}
