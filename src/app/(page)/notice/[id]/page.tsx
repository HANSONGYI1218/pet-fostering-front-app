import { Button } from '@/shared/ui/button';
import { format } from 'date-fns';
import { Download } from 'lucide-react';
import BackButton from '@/shared/widgets/navigation/back-button';
import { Badge } from '@/shared/ui/badge';
import { NOTICE_TYPE_LABEL_KO } from '@/shared/constants/enum';
import FetchErrorBox from '@/shared/widgets/feedback/fetch-error-box';
import { fetchNoticeDetail } from '@/features/notice/api/notice';
import { logError } from '@/shared/lib/logging';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function NoticeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  try {
    const notice = await fetchNoticeDetail(id);

    return (
      <main className="flex flex-col gap-6 bg-neutral-50">
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
          <BackButton link="/notice" />
          <div className="flex flex-col rounded-xl bg-white p-4 md:p-12">
            <div className="flex w-full flex-col items-center gap-6 py-6">
              <Badge
                variant={notice.isFixed ? 'green' : 'outline'}
                className="h-7 w-15 rounded-full text-sm"
              >
                {notice.isFixed
                  ? '중요'
                  : NOTICE_TYPE_LABEL_KO[notice.type]}
              </Badge>
              <div className="flex flex-col items-center gap-2">
                <span className="text-center text-lg font-semibold md:text-xl">
                  {notice.title}
                </span>
                <span className="text-xs text-neutral-600 md:text-sm">
                  {format(notice.createdAt, 'yyyy.MM.dd')}
                </span>
              </div>
            </div>

            <div className="flex min-h-96 w-full whitespace-pre-line border-y px-6 py-16 text-sm md:text-base">
              {notice.content}
            </div>

            <div className="flex w-full flex-col items-end gap-2 p-6">
              {notice.attachments.map((file) => (
                <div key={file} className="flex items-center gap-2">
                  <span className="line-clamp-1 max-w-20 text-sm text-neutral-600 md:max-w-64">
                    {file}
                  </span>
                  <Download width={15} height={15} className="cursor-pointer" />
                  <Button className="ml-4 h-7 text-xs font-medium" variant="outline">
                    미리보기
                  </Button>
                </div>
              ))}
              {notice.attachments.length === 0 ? (
                <span className="text-sm text-neutral-500">
                  첨부파일이 없습니다.
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    logError('공지 상세를 불러오는 데 실패했습니다.', error);
    const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined;

    if (status === 404) {
      notFound();
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="mx-auto w-full max-w-screen-md px-6">
          <FetchErrorBox errorMessage="공지 상세를 불러오지 못했습니다." />
          <div className="mt-6 flex justify-center">
            <Button variant="default" asChild>
              <Link href="/notice">공지 목록으로 돌아가기</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
}
