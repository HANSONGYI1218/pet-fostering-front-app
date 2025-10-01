'use client';

import { userSettingInfo } from '@/lib/dummydata';
import { Card } from '../ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

const SettingformSchema = z.object({
  comment_email: z.boolean().optional(),
  foster_animal_info_email: z.boolean().optional(),
  foster_animal_info_kakao: z.boolean().optional(),
  marketing_email: z.boolean().optional(),
  marketing_kakao: z.boolean().optional(),
});

//     import useSWR, { mutate } from 'swr';

// const { data: user } = useSWR('/api/items', fetcher);

// 삭제 후
const handleAccountDelete = async () => {
  // await fetch(`/api/items/${id}`, { method: 'DELETE' }); 계정 지우기 api
};

const user = userSettingInfo;

export default function SettingTab() {
  const form = useForm<z.infer<typeof SettingformSchema>>({
    resolver: zodResolver(SettingformSchema),
    defaultValues: {
      comment_email: user?.comment_email ?? true,
      foster_animal_info_email: user?.foster_animal_info_email ?? true,
      foster_animal_info_kakao: user?.foster_animal_info_kakao ?? true,
      marketing_email: user?.marketing_email ?? true,
      marketing_kakao: user?.marketing_kakao ?? true,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(_values: z.infer<typeof SettingformSchema>) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* {'이메일 알림'} */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">이메일 알림</h1>
          <Card className="cursor-default gap-6 px-8">
            <FormField
              control={form.control}
              name="comment_email"
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="foster_animal_info_email"
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{' '}
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="marketing_email"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>마케팅 활용 및 공과 수신 동의 알림</FormLabel>
                    <span className="text-muted-foreground">
                      각종 이벤트, 회원 혜택, 할인 행사등 이메일로 마케팅 알림을
                      받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>
        {/* {'카카오톡 알림'} */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">카카오톡 알림</h1>
          <Card className="cursor-default gap-6 px-8">
            <FormField
              control={form.control}
              name="foster_animal_info_kakao"
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <hr className="w-full" />
            <FormField
              control={form.control}
              name="marketing_kakao"
              render={({ field }) => (
                <FormItem className="flex w-full items-center justify-between">
                  <div className="flex flex-col gap-3">
                    <FormLabel>마케팅 활용 및 공과 수신 동의</FormLabel>
                    <span className="text-muted-foreground">
                      각종 이벤트, 회원 혜택, 할인 행사등 카카오톡으로 마케팅
                      알림을 받겠습니다.
                    </span>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        </div>
        {/* {'계정 삭제'} */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold">계정 삭제</h1>
          <Card className="flex w-full cursor-default flex-row items-center justify-between px-8">
            <span className="text-muted-foreground">
              계정 삭제 시 프로필 및 입양 기록이 삭제 됩니다.
            </span>
            <FormControl>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'ghost'}
                    className="text-sm text-red-500 hover:text-red-500 hover:underline hover:decoration-red-500"
                  >
                    삭제하기
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>계정을 삭제하면,</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 py-6">
                    <span className="text-neutral-700">
                      웹의 이용 정보가 삭제되고 이후 다시 웹에 회원가입하더라도
                      퍼디즈에서 활동한 모든 데이터가 복원되지 않을 수 있습니다.
                      <br />
                      <br />
                      계정 삭제를 신중하게 결정해주세요.
                    </span>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="default">취소</Button>
                    </DialogClose>
                    <Button
                      onClick={handleAccountDelete}
                      variant={'outline_black'}
                    >
                      삭제하기
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </FormControl>
            <FormMessage />
          </Card>
        </div>
      </form>
    </Form>
  );
}
