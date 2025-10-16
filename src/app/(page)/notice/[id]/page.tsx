import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import { noticeDetails } from '@/lib/dummydata';
import BackButton from '@/components/common/back-button';
import EmptyBox from '@/components/common/empty-box';
import { Badge } from '@/components/ui/badge';
import { NOTICE_TYPE_LABEL_KO } from '@/constants/enum';

export default async function NoticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notice = noticeDetails.find((notice) => notice.id === id);

  if (!notice) return <EmptyBox text="공지사항을 찾을 수 없습니다!" />;

  return (
    <main className="flex flex-col gap-6 bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
        <BackButton link="/notice" />
        <div className="flex flex-col rounded-xl bg-white p-4 md:p-12">
          <div className="flex w-full flex-col items-center gap-6 py-6">
            <Badge
              variant={notice?.isFixed ? 'red' : 'outline'}
              className="h-7 w-15 rounded-full text-sm"
            >
              {notice?.isFixed
                ? '중요'
                : notice?.type && NOTICE_TYPE_LABEL_KO[notice.type]}
            </Badge>
            <div className="flex flex-col items-center gap-2">
              <span className="text-center text-lg font-semibold md:text-xl">
                {notice?.title}
              </span>
              <span className="text-xs text-neutral-600 md:text-sm">
                {notice?.createdAt && format(notice.createdAt, 'yyyy.MM.dd')}
              </span>
            </div>
          </div>

          <div className="flex min-h-96 w-full border-y px-6 py-16 text-sm whitespace-pre-line md:text-base">
            {notice?.content}
          </div>

          <div className="flex w-full flex-col items-end gap-2 p-6">
            {notice?.files.map((file: string, index: number) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="line-clamp-1 max-w-20 text-sm text-neutral-600 md:max-w-64">
                    {file}
                  </span>
                  <Download width={15} height={15} className="cursor-pointer" />
                  <Button
                    className="ml-4 h-7 text-xs font-medium"
                    variant={'outline'}
                  >
                    미리보기
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
