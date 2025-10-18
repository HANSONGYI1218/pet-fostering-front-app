'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { UserPen, UserRoundCogIcon } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Card } from '../ui/card';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import AddressPopUp from '../common/address-popup';
import { updateMyProfile } from '@/lib/api/user';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import type {
  UpdateUserProfilePayload,
  UserProfileItem,
} from '@/types/user/user-api';

const ProfileFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phoneNumber: z.string().optional(),
  zipcode: z.string().optional(),
  address: z.string().optional(),
  addressDetail: z.string().optional(),
  introduction: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

type ProfileTabProps = {
  profile: UserProfileItem | null;
  loading: boolean;
  onProfileUpdate: (profile: UserProfileItem) => void;
};

const toFormValues = (profile: UserProfileItem | null): ProfileFormValues => ({
  name: profile?.name ?? '',
  email: profile?.email ?? '',
  phoneNumber: profile?.phoneNumber ?? '',
  zipcode: profile?.zipcode ?? '',
  address: profile?.address ?? '',
  addressDetail: profile?.addressDetail ?? '',
  introduction: profile?.introduction ?? '',
});

const toUpdatePayload = (
  values: ProfileFormValues,
): UpdateUserProfilePayload => ({
  name: values.name?.trim() ? values.name.trim() : null,
  email: values.email?.trim() ? values.email.trim() : null,
  phoneNumber: values.phoneNumber?.trim() ? values.phoneNumber.trim() : null,
  zipcode: values.zipcode?.trim() ? values.zipcode.trim() : null,
  address: values.address?.trim() ? values.address.trim() : null,
  addressDetail: values.addressDetail?.trim()
    ? values.addressDetail.trim()
    : null,
  introduction: values.introduction?.trim() ? values.introduction : null,
});

export default function ProfileTab({
  profile,
  loading,
  onProfileUpdate,
}: ProfileTabProps) {
  const [isInfoEdited, setIsInfoEdited] = useState(false);
  const [isAuthEdited, setIsAuthEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: toFormValues(profile),
  });

  useEffect(() => {
    form.reset(toFormValues(profile));
  }, [form, profile]);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      const token = resolveStoredAccessToken();

      if (!token) {
        toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
        return;
      }

      try {
        setIsSaving(true);
        const updated = await updateMyProfile(token, toUpdatePayload(values));
        onProfileUpdate(updated);
        toast.success('프로필을 저장했어요.');
        setIsInfoEdited(false);
        setIsAuthEdited(false);
      } catch (error) {
        const status = (error as { status?: number }).status;
        toast.error(
          status === 401
            ? '인증이 만료되었습니다. 다시 로그인해주세요.'
            : '프로필 저장에 실패했습니다.',
        );
      } finally {
        setIsSaving(false);
      }
    },
    [onProfileUpdate],
  );

  const submitProfile = () => form.handleSubmit(onSubmit)();

  const handleInfoButtonClick = () => {
    if (isSaving) {
      return;
    }

    if (isInfoEdited) {
      void submitProfile();
      return;
    }

    setIsInfoEdited(true);
    setIsAuthEdited(false);
  };

  const handleAuthButtonClick = () => {
    if (isSaving) {
      return;
    }

    if (isAuthEdited) {
      void submitProfile();
      return;
    }

    setIsAuthEdited(true);
    setIsInfoEdited(false);
  };

  const isEligible = profile?.isEligibleForFoster ?? false;
  const nickname = useMemo(() => profile?.name ?? '-', [profile]);

  if (loading) {
    return (
      <div className="flex w-full justify-center py-16 text-neutral-500">
        마이페이지 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="gap-2">
        <h1 className="text-xl font-semibold">
          임시보호자{' '}
          <span className={isEligible ? 'text-[#00592d]' : 'text-[#FF5F57]'}>
            {isEligible ? '등록' : '미등록'}
          </span>{' '}
          상태입니다.
        </h1>
        <span className="text-neutral-700">
          {isEligible
            ? '조건에 맞는 보호동물의 임시보호를 신청해보세요.'
            : '임시보호자로 등록해야만 보호동물 신청이 가능합니다.'}
        </span>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">기본정보</h1>
          <Button
            variant="link"
            type="button"
            onClick={() => handleInfoButtonClick()}
            disabled={isSaving}
            className="gap-1 self-end text-neutral-700"
          >
            <UserPen className="h-3 w-3" stroke="#737373" />
            {isInfoEdited ? (isSaving ? '저장 중...' : '저장하기') : '수정하기'}
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="cursor-default gap-4 px-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-24">이름</FormLabel>
                    <FormControl>
                      {isInfoEdited ? (
                        <Input
                          className="border-none bg-neutral-100 text-base text-neutral-800 shadow-none"
                          placeholder="이름을 적어주세요."
                          disabled={isSaving}
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field.value}</span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="w-full" />
              <div className="flex items-start gap-2">
                <Label className="w-24 text-base font-medium">주소</Label>
                <div
                  className={`flex w-full flex-1 gap-1 ${isInfoEdited ? 'flex-col items-start' : 'items-center'}`}
                >
                  <div
                    className={`flex items-center gap-1 ${isInfoEdited ? 'w-full' : 'w-fit'}`}
                  >
                    <FormField
                      control={form.control}
                      name="zipcode"
                      render={({ field }) => (
                        <FormItem className="w-auto">
                          <FormControl>
                            <div className="flex items-center gap-1">
                              <div
                                className={`flex h-9 items-center rounded-md ${isInfoEdited ? 'bg-neutral-100 px-3' : ''}`}
                              >
                                <span className="text-neutral-800">
                                  {field.value}
                                </span>
                              </div>
                              <span>,</span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem
                          className={`flex ${isInfoEdited ? 'w-full flex-1' : 'w-fit'}`}
                        >
                          <FormControl>
                            {isInfoEdited ? (
                              <Input
                                disabled
                                className="w-full border-none bg-neutral-100 text-base text-neutral-800 shadow-none disabled:opacity-100"
                                placeholder="주소를 적어주세요."
                                {...field}
                              />
                            ) : (
                              <span className="text-neutral-800">
                                {field.value}
                              </span>
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="addressDetail"
                    render={({ field }) => (
                      <FormItem
                        className={`flex ${isInfoEdited ? 'w-full' : 'w-fit'}`}
                      >
                        <FormControl>
                          {isInfoEdited ? (
                            <Input
                              className="w-full border-none bg-neutral-100 text-base text-neutral-800 shadow-none"
                              placeholder="상세주소를 적어주세요."
                              disabled={isSaving}
                              {...field}
                            />
                          ) : (
                            <span className="text-neutral-800">
                              {field.value}
                            </span>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {isInfoEdited ? (
                  <AddressPopUp
                    onSelect={({ zipcode, address }) => {
                      form.setValue('zipcode', zipcode);
                      form.setValue('address', address);
                    }}
                  />
                ) : null}
              </div>
              <hr className="w-full" />
              <div className="flex w-full items-center gap-2">
                <Label className="w-24 text-base font-medium">닉네임</Label>
                <span className="w-full flex-1 text-neutral-800">
                  {nickname}
                </span>
              </div>
              <hr className="w-full" />
              <FormField
                control={form.control}
                name="introduction"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <div className="flex flex-col">
                      <FormLabel className="w-24">나의 소개</FormLabel>
                      <span className="text-sm text-red-500">
                        * 나의 소개를 작성하고 매칭률을 높여보세요
                      </span>
                    </div>
                    <FormControl>
                      {isInfoEdited ? (
                        <Textarea
                          className="resize-none border-none bg-neutral-100 text-base whitespace-pre-wrap text-neutral-800 shadow-none"
                          placeholder="나의 소개를 작성해보세요."
                          disabled={isSaving}
                          {...field}
                        />
                      ) : (
                        <span className="flex-1 whitespace-pre-wrap text-neutral-800">
                          {field.value}
                        </span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </form>
        </Form>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">계정정보</h1>
          <Button
            variant="link"
            type="button"
            onClick={() => handleAuthButtonClick()}
            disabled={isSaving}
            className="gap-1 self-end text-neutral-700"
          >
            <UserRoundCogIcon className="h-3 w-3" stroke="#737373" />
            {isAuthEdited ? (isSaving ? '저장 중...' : '저장하기') : '수정하기'}
          </Button>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="cursor-default gap-4 px-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-24">이메일</FormLabel>
                    <FormControl>
                      {isAuthEdited ? (
                        <Input
                          className="border-none bg-neutral-100 text-base text-neutral-800 shadow-none"
                          placeholder="이메일을 적어주세요."
                          disabled={isSaving}
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field.value}</span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="w-full" />
              <div className="flex w-full">
                <FormLabel className="w-24">패스워드</FormLabel>
                <span className="text-neutral-800">
                  보안상 표시하지 않습니다.
                </span>
              </div>
              <hr className="w-full" />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-24">전화번호</FormLabel>
                    <FormControl>
                      {isAuthEdited ? (
                        <Input
                          className="border-none bg-neutral-100 text-base text-neutral-800 shadow-none"
                          placeholder="전화번호를 입력해주세요."
                          disabled={isSaving}
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field.value}</span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
