'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2, Pencil, Plus } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Card } from '@/shared/ui/card';
import Image from 'next/image';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { ChangeEvent, ReactElement, useMemo, useState } from 'react';
import { PostItem } from '@/entities/post/post-api';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import { toast } from 'sonner';
import { createPost, updatePost } from '../../api/community';

const PostFormSchema = z.object({
  title: z.string().trim().min(1, {
    message: '게시글의 제목을 작성해 주세요.',
  }),
  content: z.string().trim().min(1, {
    message: '내용을 작성해 주세요.',
  }),
  images: z.array(z.string()).max(5).optional(),
});

type PostFormValues = z.infer<typeof PostFormSchema>;

type PostFormDialogProps = {
  post?: PostItem;
  trigger?: ReactElement;
};

export default function PostFormDialog({ post, trigger }: PostFormDialogProps) {
  const token = resolveStoredAccessToken();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(PostFormSchema),
    defaultValues: {
      title: post?.title ?? '',
      content: post?.content ?? '',
      images: post?.images ?? [],
    },
  });

  const isEditMode = Boolean(post);
  const triggerNode = useMemo(() => {
    if (trigger) return trigger;
    return (
      <Button
        variant="destructive"
        className="w-24 rounded-2xl max-md:text-sm md:w-32"
      >
        <Pencil className="max-md:h-3 max-md:w-3" />글 작성
      </Button>
    );
  }, [trigger]);

  const closeDialog = () => {
    form.reset();
    setOpen(false);
  };

  const handleSubmit = async (_values: PostFormValues) => {
    if (!token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }

    const payload = {
      title: _values?.title,
      content: _values?.content,
    };

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (post) {
        await updatePost(token, post?.id, payload);
      } else {
        await createPost(token, payload);
      }
      toast(isEditMode ? '게시글을 수정했어요!' : '게시글을 작성했어요!');
      closeDialog();
    } catch {
      toast('잠시 뒤 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }
    setOpen(nextOpen);
  };

  const handleImageChange = (
    fieldOnChange: (value: string[]) => void,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target;
    if (!files) return;

    const urls = Array.from(files)
      .slice(0, 5)
      .map((file) => URL.createObjectURL(file));

    const current = form.getValues('images') ?? [];
    const next = [...current, ...urls].slice(0, 5);

    fieldOnChange(next);
  };

  const handleRemoveImage = (
    fieldOnChange: (value: string[]) => void,
    images: string[] | undefined,
    target: string,
  ) => {
    if (!images) return;
    const next = images.filter((image) => image !== target);
    fieldOnChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{triggerNode}</DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col space-y-8"
          >
            <DialogHeader>
              <DialogTitle>게시글 {isEditMode ? '수정' : '작성'}</DialogTitle>
            </DialogHeader>
            <div className="flex w-full flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목</FormLabel>
                    <FormControl>
                      <Input placeholder="제목을 입력해주세요." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>내용</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={`퍼디는 유기동물과 임시보호 문화를 존중하는 모두를 위한 따뜻한 커뮤니티입니다.
모든 사용자가 기분 좋게 소통할 수 있도록 아래 내용을 꼭 확인해 주세요.

※ 위반 시 게시물이 삭제되거나 서비스 이용이 제한될 수 있습니다.
1. 퍼디는 유기동물, 임시보호, 입양 등 관련 주제 중심의 커뮤니티입니다
2. 타인을 비방하거나 불쾌하게 만드는 언행은 삼가 주세요
3. 혐오, 욕설, 선정적 표현 등은 허용되지 않습니다
4. 개인정보를 무단 수집하거나 노출하는 행위는 금지됩니다
5. 정치, 종교, 젠더, 사회적 이슈 등 논쟁을 유발할 수 있는 주제는 삼가 주세요
6. 상업적 홍보나 모집은 제한됩니다
7. 확인되지 않은 내용, 오해를 불러일으킬 수 있는 정보 공유는 자제해 주세요
8. 신뢰할 수 있는 정보 공유를 통해 건강한 커뮤니티를 함께 만들어 주세요

※ 관련 법률을 위반한 게시물은 삭제되며, 영구 이용 제한 또는 법적 처벌을 받을 수 있습니다.`}
                        className="min-h-40 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-col gap-1">
                      <FormLabel>첨부 사진</FormLabel>
                      <span className="text-xs font-normal text-neutral-500">
                        * 사진은 최대 5장까지 등록 가능합니다.
                      </span>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
                      {(!field.value || field.value.length < 5) && (
                        <Card className="relative z-0 h-32 items-center justify-center overflow-hidden shadow-none">
                          <div className="absolute z-10 flex h-full w-full">
                            <label
                              htmlFor="communityPostImages"
                              className="flex w-full cursor-pointer items-center justify-center"
                            >
                              <Plus className="h-10 w-10 text-neutral-300" />
                            </label>
                            <input
                              id="communityPostImages"
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(event) => {
                                handleImageChange(field.onChange, event);
                              }}
                              className="hidden"
                            />
                          </div>
                        </Card>
                      )}
                      {(field.value ?? []).map((image, index) => (
                        <Card className="relative p-0 shadow-none" key={image}>
                          <Button
                            type="button"
                            onClick={() => {
                              handleRemoveImage(
                                field.onChange,
                                field.value,
                                image,
                              );
                            }}
                            className="absolute -top-2 -right-2 z-10 flex h-6 w-6 rounded-full bg-neutral-300 p-0"
                          >
                            <Plus
                              className="h-4 w-4 rotate-45 text-white"
                              strokeWidth={2.5}
                            />
                          </Button>
                          <div className="relative h-32 w-full">
                            <Image
                              src={image}
                              alt={`preview-${index + 1}`}
                              fill
                              className="rounded-xl object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              unoptimized
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="mt-10">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="w-24">
                  취소
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="destructive"
                className="w-24"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : '작성'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
