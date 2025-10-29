'use client';

import { Loader2, MoveUp } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import NeedLoginBadge from '@/shared/widgets/feedback/need-login-badge';
import {
  updateComment,
  createComment,
  fetchCommunityComments,
} from '../../api/community';
import { CommentItem } from '@/entities/comment/comment-api';

type CommentFormMode = 'create' | 'reply' | 'edit';

type CommentDraft = {
  id?: string;
  parentId?: string;
  content?: string;
  mode?: CommentFormMode;
};

const CommentsFormSchema = z.object({
  comment: z.string().trim().min(1, {
    message: '댓글을 작성해 주세요.',
  }),
});

type CommentsFormValues = z.infer<typeof CommentsFormSchema>;

type CommentsFormProps = {
  draft?: CommentDraft | null;
  heightClassName?: string;
  postId: string;
  onClose?: () => void;
  handleComments?: (updater: (prev: CommentItem[]) => CommentItem[]) => void;
};

const resolveToastMessage = (mode: CommentFormMode) => {
  switch (mode) {
    case 'edit':
      return '댓글을 수정했어요.';
    case 'reply':
      return '답글을 등록했어요.';
    default:
      return '댓글을 등록했어요.';
  }
};

export default function CommentsForm({
  draft,
  postId,
  heightClassName,
  onClose,
  handleComments,
}: CommentsFormProps) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<CommentsFormValues>({
    resolver: zodResolver(CommentsFormSchema),
    defaultValues: {
      comment: draft?.content ?? '',
    },
  });
  const mode = draft?.mode ?? 'create';

  // 브라우저에서만 access token 읽기
  useEffect(() => {
    const stored = resolveStoredAccessToken();
    setToken(stored);
  }, []);

  const handleSubmit = async (_values: CommentsFormValues) => {
    if (!token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }
    if (!postId) {
      return toast('다시 한번 새로고침 해주세요.');
    }
    const payload = {
      content: _values?.comment,
      parentId: draft?.parentId ?? undefined,
    };
    setIsLoading(true);

    try {
      if (draft?.id) {
        await updateComment(token, postId, draft.id, payload);
      } else {
        await createComment(token, postId, payload);
      }

      if (handleComments) {
        const refreshed = await fetchCommunityComments(postId, token);
        handleComments(() => refreshed);
      }

      toast(resolveToastMessage(mode));
      form.reset({ comment: '' });
      onClose?.();
    } catch {
      toast('잠시 뒤 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    !token || (form.watch('comment')?.trim().length ?? 0) === 0 || isLoading;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="relative mb-4 flex w-full flex-col items-center gap-5 md:flex-row"
      >
        {!token && (
          <NeedLoginBadge className="absolute max-md:bottom-10 max-md:left-1/2 max-md:-translate-x-1/2 md:top-6 md:-right-10" />
        )}
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="댓글을 남겨주세요."
                  className={`min-h-24 resize-none bg-[#fdfdfd] ${heightClassName ?? ''}`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isDisabled}
          variant="destructive"
          className="h-10 w-full md:hidden"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : '작성하기'}
        </Button>
        <Button
          type="submit"
          disabled={isDisabled}
          variant="destructive"
          className="hidden h-10 w-10 rounded-full p-2 md:flex"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <MoveUp stroke="#ffffff" strokeWidth={2} />
          )}
        </Button>
      </form>
    </Form>
  );
}
