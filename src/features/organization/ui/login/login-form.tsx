'use client';

import { Input } from '@/shared/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { completeLoginWithCredentials } from '../../api/login';

const LoginSchema = z.object({
  authId: z.string().min(1, { message: '아이디를 적어주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 적어주세요.' }),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      authId: '',
      password: '',
    },
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  async function onSubmit(data: z.infer<typeof LoginSchema>) {
    if (!data.authId || !data.password) {
      return toast('로그인, 비밀번호가 없습니다.', {
        description: '로그인과 비밀번호가 작성되었는지 확인해주세요',
      });
    }
    try {
      setIsLoading(true);
      const tokens = await completeLoginWithCredentials({
        id: data.authId,
        password: data.password,
        storage: localStorage, // 로컬에 토큰 저장
      });

      if (!tokens) {
        throw new Error('로그인 실패: 토큰이 없습니다.');
      }
      const savedUrl = sessionStorage.getItem('RETURN_URL') ?? '/';
      router.replace(savedUrl);
      sessionStorage.removeItem('RETURN_URL');

      setIsLoading(false);
    } catch (error: any) {
      toast('기업 로그인 요청이 실패했습니다.', {
        description: '잠시 후 다시 시도해 주세요.',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col justify-center gap-6"
      >
        <FormField
          control={form.control}
          name="authId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="아이디를 작성해주세요."
                  className="h-12 disabled:cursor-default"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-3">
                <Input
                  autoComplete="new-password"
                  type={isPasswordShow ? 'text' : 'password'}
                  placeholder="비밀번호를 작성해주세요."
                  className="h-12 disabled:cursor-default"
                  {...field}
                />

                {isPasswordShow ? (
                  <Eye
                    cursor="pointer"
                    className="h-5 w-5"
                    onClick={() => {
                      setIsPasswordShow(false);
                    }}
                  />
                ) : (
                  <EyeOff
                    cursor="pointer"
                    className="h-5 w-5"
                    onClick={() => {
                      setIsPasswordShow(true);
                    }}
                  />
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={'destructive'}
          className="mt-12 h-12 w-full"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : '로그인'}
        </Button>
      </form>
    </Form>
  );
}
