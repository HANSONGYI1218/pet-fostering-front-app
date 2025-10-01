'use client';

import { dummyUser } from '@/lib/dummydata';
import { Card } from '../ui/card';
import { useState } from 'react';
import { UserPen, UserRoundCogIcon } from 'lucide-react';
import { Button } from '../ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import AddressPopUp from '../common/address-popup';

export const ProfileformSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone_number: z.string().optional(),
  zipcode: z.string(),
  address: z.string().optional(),
  address_datail: z.string().optional(),
  introduction: z.string().optional(),
});

//     import useSWR, { mutate } from 'swr';

// const { data: user } = useSWR('/api/items', fetcher);

// // 삭제 후
// const handleDelete = async (id: number) => {
//   await fetch(`/api/items/${id}`, { method: 'DELETE' });
//   mutate('/api/items'); // 다시 fetch
// };

const user = dummyUser;

export default function ProfileTab() {
  const form = useForm<z.infer<typeof ProfileformSchema>>({
    resolver: zodResolver(ProfileformSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone_number: user?.phone_number ?? '',
      zipcode: user?.zipcode ?? '',
      address: user?.address ?? '',
      address_datail: user?.address_datail ?? '',
      introduction: user?.introduction ?? '',
    },
  });

  const [isInfoEdited, setIsInfoEdited] = useState(false);
  const [isAuthEdited, setIsAuthEdited] = useState(false);

  // 2. Define a submit handler.
  function onSubmit(_values: z.infer<typeof ProfileformSchema>) {}

  return (
    <div className="flex w-full flex-col gap-10">
      <Card className="gap-2">
        <h1 className="text-xl font-semibold">
          임시보호자{' '}
          <span
            className={`${user?.isEligibleForFoster === true ? 'text-[#00592d]' : 'text-[#FF5F57]'}`}
          >
            {user?.isEligibleForFoster === true ? '등록' : '미등록'}
          </span>{' '}
          상태입니다.
        </h1>
        <span className="text-neutral-700">
          {user?.isEligibleForFoster === true
            ? `조건에 맞는 보호동물의 임시보호를 신청해보세요.`
            : '임시보호자로 등록해야만 보호동물 신청이 가능합니다.'}
        </span>
      </Card>
      {/* {'기본정보'} */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">기본정보</h1>
          <Button
            variant={'link'}
            onClick={() => {
              setIsInfoEdited(!isInfoEdited);
            }}
            className="gap-1 self-end text-neutral-700"
          >
            <UserPen className="h-3 w-3" stroke={'#737373'} />
            {isInfoEdited ? '저장하기' : '수정하기'}
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
                          className={`border-none bg-neutral-100 text-base text-neutral-800 shadow-none`}
                          placeholder="이름을 적어주세요."
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field?.value}</span>
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
                  className={`flex w-full flex-1 gap-1 ${isInfoEdited ? 'flex-col items-start' : 'flew-row items-center'}`}
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
                                <span className={`text-neutral-800`}>
                                  {field?.value}
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
                                className={`w-full border-none bg-neutral-100 text-base text-neutral-800 shadow-none disabled:opacity-100`}
                                placeholder="주소를 적어주세요."
                                {...field}
                              />
                            ) : (
                              <span className="text-neutral-800">
                                {field?.value}
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
                    name="address_datail"
                    render={({ field }) => (
                      <FormItem
                        className={`flex ${isInfoEdited ? 'w-full' : 'w-fit'}`}
                      >
                        <FormControl>
                          {isInfoEdited ? (
                            <Input
                              className={`w-full border-none bg-neutral-100 text-base text-neutral-800 shadow-none`}
                              placeholder="상세주소를 적어주세요."
                              {...field}
                            />
                          ) : (
                            <span className="text-neutral-800">
                              {field?.value}
                            </span>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {isInfoEdited && <AddressPopUp form={form} />}
              </div>
              <hr className="w-full" />
              <div className="flex w-full items-center gap-2">
                <Label className="w-24 text-base font-medium">닉네임</Label>
                <span className="w-full flex-1 text-neutral-800">
                  {user?.nickname}
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
                        * 나의 소개를 작성하고 매칭율을 높여보세요
                      </span>
                    </div>
                    <FormControl>
                      {isInfoEdited ? (
                        <Textarea
                          className={`resize-none border-none bg-neutral-100 text-base whitespace-pre-wrap text-neutral-800 shadow-none`}
                          placeholder="이름을 적어주세요."
                          {...field}
                        />
                      ) : (
                        <span className="flex-1 whitespace-pre-wrap text-neutral-800">
                          {field?.value}
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
      {/* {'계정정보'} */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">계정정보</h1>
          <Button
            variant={'link'}
            onClick={() => {
              setIsAuthEdited(!isAuthEdited);
            }}
            className="gap-1 self-end text-neutral-700"
          >
            <UserRoundCogIcon className="h-3 w-3" stroke={'#737373'} />
            {isAuthEdited ? '저장하기' : '수정하기'}
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
                          className={`border-none bg-neutral-100 text-base text-neutral-800 shadow-none`}
                          placeholder="이름을 적어주세요."
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field?.value}</span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="w-full" />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-24">패스워드</FormLabel>
                    <FormControl>
                      {isAuthEdited ? (
                        <Input
                          className={`border-none bg-neutral-100 text-base text-neutral-800 shadow-none`}
                          placeholder="이름을 적어주세요."
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field?.value}</span>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <hr className="w-full" />
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="flex w-full">
                    <FormLabel className="w-24">전화번호</FormLabel>
                    <FormControl>
                      {isAuthEdited ? (
                        <Input
                          className={`text-neutral-800} text-base`}
                          placeholder="이름을 적어주세요."
                          {...field}
                        />
                      ) : (
                        <span className="text-neutral-800">{field?.value}</span>
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
