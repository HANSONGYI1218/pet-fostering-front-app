/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronRight, Loader2, UserPen, UserRoundCogIcon } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import AddressPopUp from '@/shared/widgets/map/address-popup';
import { updateMyProfile } from '@/features/mypage/api/user';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import type {
  UpdateUserProfilePayload,
  UserProfileItem,
} from '@/entities/user/user-api';
import { MypageStep } from '../lib/mypage-steps';
import { Badge } from '@/shared/ui/badge';
import EmailVerifyButton from '@/shared/widgets/map/email-verify-button';
import PhoneNumberVerifyPopup from '@/shared/widgets/map/phone-number-verify-popup';
import { createLimitedOnChange } from '@/shared/lib/utils';

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

export enum VerifyType {
  WAITING = 'WAITING',
  INVALID = 'INVALID',
  ACCESS = 'ACCESS',
  REJECT = 'REJECT',
}

type ProfileTabProps = {
  profile: UserProfileItem | null;
  loading: boolean;
  onProfileUpdate: (profile: UserProfileItem) => void;
  setCurrentStep: (step: MypageStep) => void;
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

const getVerifyMessage = (status: VerifyType | null, type: string) => {
  switch (status) {
    case VerifyType.ACCESS:
      return `${type} 인증이 완료되었습니다.`;
    case VerifyType.REJECT:
      return `다시 한번 ${type} 인증을 해주세요!`;
    case VerifyType.INVALID:
      return `${type} 형식이 올바르지 않습니다.`;
    default:
      return null;
  }
};

export const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');

  let formatted = digits;
  if (digits.length > 3 && digits.length <= 7) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else if (digits.length > 7) {
    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }

  return formatted;
};

export default function ProfileTab({
  profile,
  loading,
  onProfileUpdate,
  setCurrentStep,
}: ProfileTabProps) {
  const [isInfoEdited, setIsInfoEdited] = useState(false);
  const [isAuthEdited, setIsAuthEdited] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [emailVerify, setEmailVerify] = useState<VerifyType>(
    VerifyType.WAITING,
  );
  const [phoneNumberVerify, setPhoneNumberVerify] = useState<VerifyType>(
    VerifyType.WAITING,
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: toFormValues(profile),
  });

  useEffect(() => {
    form.reset(toFormValues(profile));
    setEmailVerify(VerifyType.WAITING);
    setPhoneNumberVerify(VerifyType.WAITING);
  }, [form, profile, isInfoEdited, isAuthEdited]);

  const onSubmit = useCallback(
    async (values: ProfileFormValues) => {
      let updated;
      let payload: UpdateUserProfilePayload;

      const token = resolveStoredAccessToken();

      if (!token) {
        toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
        return;
      }

      if (isInfoEdited) {
        payload = {
          name: values.name?.trim() ?? profile?.name ?? '',
          zipcode: values.zipcode?.trim() ?? profile?.zipcode ?? '',
          address: values.address?.trim() ?? profile?.address ?? '',
          addressDetail:
            values.addressDetail?.trim() ?? profile?.addressDetail ?? '',
          introduction:
            values.introduction?.trim() ?? profile?.introduction ?? '',
        };
      } else {
        payload = {
          email: values.email?.trim() ?? profile?.email ?? '',
          phoneNumber: values.phoneNumber?.trim() ?? profile?.phoneNumber ?? '',
        };
      }

      try {
        setIsSaving(true);

        updated = await updateMyProfile(token, payload);
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

  const resetVerify = (type: string) => {
    let currentVerify;
    let setCurrentVerify;

    if (type === '이메일') {
      currentVerify = emailVerify;
      setCurrentVerify = setEmailVerify;
    } else {
      currentVerify = phoneNumberVerify;
      setCurrentVerify = setPhoneNumberVerify;
    }

    if (
      currentVerify === VerifyType.INVALID ||
      currentVerify === VerifyType.ACCESS ||
      currentVerify === VerifyType.REJECT
    ) {
      setCurrentVerify(VerifyType.WAITING);
    }
  };

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

  const handleTabChange = () => {
    setCurrentStep('foster');
  };

  const watchedEmail = form.watch('email');
  const watchedPhone = form.watch('phoneNumber');

  const canSubmit =
    !isAuthEdited ||
    ((watchedEmail === profile?.email ||
      (watchedEmail !== profile?.email && emailVerify === VerifyType.ACCESS)) &&
      (watchedPhone === profile?.phoneNumber ||
        (watchedPhone !== profile?.phoneNumber &&
          phoneNumberVerify === VerifyType.ACCESS)));

  const isEligible = profile?.isEligibleForFoster ?? false;
  const nickname = useMemo(() => profile?.name ?? '-', [profile]);

  if (loading) {
    return (
      <div className="flex w-full justify-center py-16 text-neutral-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="cursor-default gap-2">
        <h1 className="text-xl font-semibold">
          임시보호자{' '}
          <span className={isEligible ? 'text-[#00592d]' : 'text-[#FF5F57]'}>
            {isEligible ? '등록' : '미등록'}
          </span>{' '}
          상태입니다.
        </h1>
        <div className="flex w-full items-center justify-between">
          <span className="text-neutral-700">
            {isEligible
              ? '조건에 맞는 보호동물의 임시보호를 신청해보세요.'
              : '임시보호자로 등록해야만 보호동물 신청이 가능합니다.'}
          </span>
          <Button
            variant={'link'}
            onClick={handleTabChange}
            className={`gap-1 text-sm ${isEligible ? 'hidden' : 'flex'}`}
          >
            등록하기 <ChevronRight />
          </Button>
        </div>
      </Card>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">기본정보</h1>
          <div className="flex self-end">
            <Button
              variant="link"
              type="button"
              onClick={() => {
                form.reset(toFormValues(profile));
                setIsInfoEdited(false);
              }}
              disabled={isSaving}
              className={`text-neutral-700 ${isInfoEdited ? 'flex' : 'hidden'}`}
            >
              취소
            </Button>
            <Button
              variant="link"
              type="button"
              onClick={() => handleInfoButtonClick()}
              disabled={isSaving}
              className="gap-1 self-end text-neutral-700"
            >
              <UserPen className="h-3 w-3" stroke="#737373" />
              {isInfoEdited ? (
                isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  '저장하기'
                )
              ) : (
                '수정하기'
              )}
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="cursor-default gap-4 px-8">
              <div className="flex w-full items-center gap-2">
                <Label className="w-24 text-base font-medium">이름</Label>
                <span className="w-full flex-1 text-neutral-800">
                  {profile?.name}
                </span>
              </div>
              <hr className="w-full" />
              <div className="flex items-start gap-2">
                <Label className={`w-24 text-base font-medium`}>주소</Label>
                <div className="flex w-full flex-1 flex-col gap-2">
                  <div className="flex w-full gap-1">
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
                                className="w-full border-none bg-neutral-100 text-neutral-800 shadow-none disabled:opacity-100"
                                placeholder="주소를 적어주세요."
                                {...field}
                              />
                            ) : (
                              <span
                                className={`${profile?.address ? 'text-neutral-800' : 'text-red-500'}`}
                              >
                                {profile?.address
                                  ? field.value
                                  : '* 주소를 작성해주세요.'}
                              </span>
                            )}
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    {isInfoEdited ? (
                      <AddressPopUp
                        onSelect={({ zipcode, address }) => {
                          form.setValue('zipcode', zipcode);
                          form.setValue('address', address);
                        }}
                      />
                    ) : null}
                  </div>
                  <FormField
                    control={form.control}
                    name="addressDetail"
                    render={({ field }) => (
                      <FormItem className={`flex w-full`}>
                        <FormControl>
                          {isInfoEdited ? (
                            <Input
                              className="w-full border-none bg-neutral-100 text-neutral-800 shadow-none"
                              placeholder="상세주소를 적어주세요."
                              maxLength={50}
                              disabled={isSaving}
                              {...field}
                            />
                          ) : (
                            <span className="text-neutral-800">
                              {field.value}
                            </span>
                          )}
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
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
                  <FormItem className="flex w-full flex-col gap-4">
                    <div className="flex w-full items-center gap-3">
                      <FormLabel>나의 소개</FormLabel>
                      <Badge
                        variant={'default'}
                        className="text-sm text-[#00592d]"
                      >
                        매칭률 Up!
                      </Badge>
                    </div>
                    <FormControl>
                      {isInfoEdited ? (
                        <Textarea
                          className="h-56 resize-none border-none bg-neutral-100 whitespace-pre-wrap text-neutral-800 shadow-none"
                          placeholder="나의 소개를 작성하여 매칭률을 높여보세요."
                          disabled={isSaving}
                          maxLength={2000}
                          value={field?.value ?? ''}
                          onChange={createLimitedOnChange(10, field.onChange)}
                        />
                      ) : (
                        <span
                          className={`flex-1 whitespace-pre-wrap ${profile?.introduction ? 'text-neutral-800' : 'text-red-500'}`}
                        >
                          {profile?.introduction
                            ? field.value
                            : '* 나의 소개를 작성해주세요.'}
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
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">계정정보</h1>
          <div className="flex self-end">
            <Button
              variant="link"
              type="button"
              onClick={() => {
                form.reset(toFormValues(profile));
                setIsAuthEdited(false);
              }}
              disabled={isSaving}
              className={`text-neutral-700 ${isAuthEdited ? 'flex' : 'hidden'}`}
            >
              취소
            </Button>
            <Button
              variant="link"
              type="button"
              onClick={() => handleAuthButtonClick()}
              disabled={isSaving || !canSubmit}
              className="gap-1 self-end text-neutral-700"
            >
              <UserRoundCogIcon className="h-3 w-3" stroke="#737373" />
              {isAuthEdited ? (
                isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  '저장하기'
                )
              ) : (
                '수정하기'
              )}
            </Button>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className="cursor-default gap-4 px-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row">
                    <FormLabel className="w-24">이메일</FormLabel>
                    <FormControl>
                      <div className="flex w-full flex-col">
                        <div className="flex w-full justify-between gap-2">
                          {isAuthEdited ? (
                            <Input
                              className="flex-1 border-none bg-neutral-100 text-neutral-800 shadow-none"
                              placeholder="이메일을 적어주세요."
                              disabled={isSaving}
                              value={field?.value ?? ''}
                              maxLength={100}
                              onChange={(e) => {
                                field.onChange(e);
                                resetVerify('이메일');
                              }}
                            />
                          ) : (
                            <span
                              className={`${profile?.email ? 'text-neutral-800' : 'text-red-500'}`}
                            >
                              {profile?.email
                                ? field.value
                                : '* 이메일을 작성해주세요.'}
                            </span>
                          )}
                          {isAuthEdited && (
                            <EmailVerifyButton
                              email={field?.value ?? ''}
                              setEmailVerify={setEmailVerify}
                            />
                          )}
                          <span
                            className={`text-sm ${emailVerify === VerifyType.ACCESS ? 'text-green-500' : 'text-red-500'} ${emailVerify === VerifyType.WAITING && 'hidden'}`}
                          >
                            {getVerifyMessage(emailVerify, '이메일')}
                          </span>
                        </div>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <hr className="w-full" />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-row">
                    <FormLabel className="w-24">전화번호</FormLabel>
                    <FormControl>
                      <div className="flex w-full flex-col">
                        <div className="flex w-full gap-2">
                          {isAuthEdited ? (
                            <Input
                              className="flex-1 border-none bg-neutral-100 text-neutral-800 shadow-none"
                              placeholder="전화번호를 입력해주세요."
                              disabled={isSaving}
                              value={field?.value ?? ''}
                              maxLength={13}
                              onChange={(e) => {
                                field.onChange(
                                  formatPhoneNumber(e.target.value),
                                );
                                resetVerify('전화번호');
                              }}
                            />
                          ) : (
                            <span
                              className={`${profile?.phoneNumber ? 'text-neutral-800' : 'text-red-500'}`}
                            >
                              {profile?.phoneNumber
                                ? field.value
                                : '* 전화번호을 작성해주세요.'}
                            </span>
                          )}
                          {isAuthEdited && (
                            <PhoneNumberVerifyPopup
                              phoneNumber={field?.value ?? ''}
                              setPhoneNumberVerify={setPhoneNumberVerify}
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm ${emailVerify === VerifyType.ACCESS ? 'text-green-500' : 'text-red-500'} ${emailVerify === VerifyType.WAITING && 'hidden'}`}
                        >
                          {getVerifyMessage(phoneNumberVerify, '전화번호')}
                        </span>
                      </div>
                    </FormControl>
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
