import { UserInfoItem } from '@/entities/user/user-api';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { TableCell } from '@/shared/ui/table';
import { ExternalLink } from 'lucide-react';
import PostTile from './post-tile';
import CommentTile from './comment-tile';
import AnimalTile from './animal-tile';

export function DetailInfoDialog({ user }: { user: UserInfoItem }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableCell className="flex items-center justify-center underline">
          <ExternalLink className="h-3 w-3 cursor-pointer" stroke="#737373" />
        </TableCell>
      </DialogTrigger>
      <DialogContent
        className="flex w-[90vw] max-w-[1200px] flex-col gap-6 p-6"
        style={{ width: '90vw', maxWidth: '1200px' }}
      >
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2 py-2">
            <h1 className="text-lg font-semibold">{user?.name}</h1>
            <Badge
              variant={user?.isEligibleForFoster ? 'default' : 'destructive'}
            >
              {user?.isEligibleForFoster
                ? '임시보호자 자격 등록'
                : '임시보호자 자격 미등록'}
            </Badge>
          </div>
          <div className="flex w-full gap-10">
            <Card className="h-fit cursor-default">
              <div className="flex w-full gap-2">
                <span className="w-16 text-neutral-500">이메일</span>
                <span className="flex-2 text-neutral-700">{user?.email}</span>
              </div>
              <div className="flex w-full gap-2">
                <span className="w-16 text-neutral-500">전화번호</span>
                <span className="flex-2 text-neutral-700">
                  {user?.phoneNumber}
                </span>
              </div>
              <div className="flex w-full gap-2">
                <span className="w-16 text-neutral-500">주소</span>
                <span className="flex-2 text-neutral-700">
                  {user?.address} {user?.addressDetail}
                </span>
              </div>
              <div className="flex w-full gap-2">
                <span className="w-16 text-neutral-500">소개</span>
                <span className="flex-2 whitespace-pre-line text-neutral-700">
                  {user?.introduction}
                </span>
              </div>
              <div className="flex w-full gap-2">
                <span className="w-16 text-neutral-500">알림</span>
                <div className="flex flex-col gap-1">
                  <div className="flex w-full gap-2">
                    <span className="w-32 text-neutral-500">게시글 이메일</span>
                    <span className="flex-2 text-neutral-700">
                      {user?.notification?.commentEmail ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="flex w-full gap-2">
                    <span className="w-32 text-neutral-500">
                      임시보호 이메일
                    </span>
                    <span className="flex-2 text-neutral-700">
                      {user?.notification?.fosterAnimalInfoEmail ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="flex w-full gap-2">
                    <span className="w-32 text-neutral-500">마케팅 이메일</span>
                    <span className="flex-2 text-neutral-700">
                      {user?.notification?.marketingEmail ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="flex w-full gap-2">
                    <span className="w-32 text-neutral-500">
                      임시보호 알림톡
                    </span>
                    <span className="flex-2 text-neutral-700">
                      {user?.notification?.fosterAnimalInfoKakao ? 'ON' : 'OFF'}
                    </span>
                  </div>
                  <div className="flex w-full gap-2">
                    <span className="w-32 text-neutral-500">마케팅 알림톡</span>
                    <span className="flex-2 text-neutral-700">
                      {user?.notification?.marketingKakao ? 'ON' : 'OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
            <div className="flex w-3/4 flex-col gap-4 overflow-hidden">
              <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold">
                  임시보호동물 ({user?.animals?.length})
                </h1>
                <Card className="cursor-default overflow-hidden">
                  <div className="scroll_none flex w-full flex-row gap-6 overflow-x-auto">
                    {user?.animals?.map((animal) => (
                      <AnimalTile key={animal?.id} animal={animal} />
                    ))}
                  </div>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold">
                  게시글 ({user?.posts?.length})
                </h1>
                <Card className="cursor-default overflow-hidden">
                  <div className="scroll_none flex w-full flex-row gap-6 overflow-x-auto">
                    {user?.posts?.map((post) => (
                      <PostTile key={post?.id} post={post} />
                    ))}
                  </div>
                </Card>
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-lg font-semibold">
                  댓글 ({user?.comments?.length})
                </h1>
                <Card className="cursor-default overflow-hidden">
                  <div className="scroll_none flex w-full flex-row gap-6 overflow-x-auto">
                    {user?.comments?.map((comment) => (
                      <CommentTile key={comment?.id} comment={comment} />
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
