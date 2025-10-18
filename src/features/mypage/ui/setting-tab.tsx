'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Switch } from '@/shared/ui/switch';
import { Button } from '@/shared/ui/button';
import {
  deleteMyAccount,
  fetchMyNotificationSetting,
  updateMyNotificationSetting,
} from '@/features/mypage/api/user';
import {
  clearStoredAuthTokens,
  resolveStoredAccessToken,
} from '@/lib/auth/session';
import type {
  UpdateUserNotificationSettingPayload,
  UserNotificationSettingItem,
} from '@/entities/user/user-api';

const SettingFormSchema = z.object({
  commentEmail: z.boolean().optional(),
  fosterAnimalInfoEmail: z.boolean().optional(),
  fosterAnimalInfoKakao: z.boolean().optional(),
  marketingEmail: z.boolean().optional(),
  marketingKakao: z.boolean().optional(),
});

type SettingFormValues = z.infer<typeof SettingFormSchema>;

type SettingTabProps = {
  settings: UserNotificationSettingItem | null;
  loading: boolean;
  onSettingsUpdate: (settings: UserNotificationSettingItem) => void;
};

const toSettingValues = (
  settings: UserNotificationSettingItem | null,
): SettingFormValues => ({
  commentEmail: settings?.commentEmail ?? true,
  fosterAnimalInfoEmail: settings?.fosterAnimalInfoEmail ?? true,
  fosterAnimalInfoKakao: settings?.fosterAnimalInfoKakao ?? true,
  marketingEmail: settings?.marketingEmail ?? false,
  marketingKakao: settings?.marketingKakao ?? false,
});

const toUpdatePayload = (
  values: SettingFormValues,
): UpdateUserNotificationSettingPayload => ({
  commentEmail: values.commentEmail ?? false,
  fosterAnimalInfoEmail: values.fosterAnimalInfoEmail ?? false,
  fosterAnimalInfoKakao: values.fosterAnimalInfoKakao ?? false,
  marketingEmail: values.marketingEmail ?? false,
  marketingKakao: values.marketingKakao ?? false,
});

export default function SettingTab({
  settings,
  loading,
  onSettingsUpdate,
}: SettingTabProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(SettingFormSchema),
    defaultValues: toSettingValues(settings),
  });

  useEffect(() => {
    form.reset(toSettingValues(settings));
  }, [form, settings]);

  const onSubmit = useCallback(
    async (values: SettingFormValues) => {
      const token = resolveStoredAccessToken();

      if (!token) {
        toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
        return;
      }

      try {
        setIsSaving(true);
        const payload = toUpdatePayload(values);
        await updateMyNotificationSetting(token, payload);
        const latest = await fetchMyNotificationSetting(token);
        onSettingsUpdate(latest);
        form.reset(toSettingValues(latest));
        toast.success('알림 설정을 저장했어요.');
      } catch (error) {
        const status = (error as { status?: number }).status;
        toast.error(
          status === 401
            ? '인증이 만료되었습니다. 다시 로그인해주세요.'
            : '알림 설정 저장에 실패했습니다.',
        );
      } finally {
        setIsSaving(false);
      }
    },
    [form, onSettingsUpdate],
  );

  const handleAccountDelete = useCallback(async () => {
    const token = resolveStoredAccessToken();

    if (!token) {
      toast.error('로그인이 필요합니다. 다시 로그인해주세요.');
      return;
    }

    try {
      setIsDeleting(true);
      await deleteMyAccount(token);
      clearStoredAuthTokens();
      toast.success('계정을 삭제했어요. 메인 페이지로 이동합니다.');
      router.replace('/');
    } catch (error) {
      const status = (error as { status?: number }).status;
      toast.error(
        status === 401
          ? '인증이 만료되었습니다. 다시 로그인해주세요.'
          : '계정 삭제에 실패했습니다.',
      );
    } finally {
      setIsDeleting(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex w-full justify-center py-16 text-neutral-500">
        알림 설정을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">이메일 알림</h1>
          <Card className="cursor-default gap-6 px-8">
            <FormField
              control={form.control}
              name="commentEmail"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>게시글 알림</FormLabel>
                    <span className="text-muted-foreground">
                      나의 게시글에 댓글이 달리면 이메일로 알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={loading || isSaving || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="fosterAnimalInfoEmail"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>임시보호 알림</FormLabel>
                    <span className="text-muted-foreground">
                      임시보호 매칭시 이메일로 알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={loading || isSaving || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="marketingEmail"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>마케팅 활용 및 공고 수신 동의</FormLabel>
                    <span className="text-muted-foreground">
                      각종 이벤트, 회원 혜택, 할인 행사 등 이메일로 마케팅
                      알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={loading || isSaving || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">카카오톡 알림</h1>
          <Card className="cursor-default gap-6 px-8">
            <FormField
              control={form.control}
              name="fosterAnimalInfoKakao"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>임시보호 알림</FormLabel>
                    <span className="text-muted-foreground">
                      임시보호 매칭시 카카오톡으로 알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={loading || isSaving || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="marketingKakao"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>마케팅 활용 및 공고 수신 동의</FormLabel>
                    <span className="text-muted-foreground">
                      각종 이벤트, 회원 혜택, 할인 행사 등 카카오톡으로 마케팅
                      알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                      disabled={loading || isSaving || isDeleting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">계정 삭제</h1>
          <Card className="flex w-full cursor-default flex-row items-center justify-between px-8">
            <span className="text-muted-foreground">
              계정 삭제 시 프로필 및 활동 기록이 삭제됩니다.
            </span>
            <FormControl>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-sm text-red-500 hover:text-red-500 hover:underline hover:decoration-red-500"
                  >
                    계정 삭제하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>정말 계정을 삭제하시겠어요?</DialogTitle>
                  </DialogHeader>
                  <div className="text-muted-foreground py-4 text-sm">
                    계정을 삭제하면 활동 기록이 모두 삭제되며 복구할 수
                    없습니다.
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={isDeleting}
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={() => void handleAccountDelete()}
                    >
                      {isDeleting ? '삭제 중...' : '삭제하기'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </FormControl>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="destructive"
            disabled={isSaving || loading || isDeleting}
            className="min-w-28"
          >
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
