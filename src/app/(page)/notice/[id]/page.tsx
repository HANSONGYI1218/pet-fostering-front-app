import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarDays, Download } from 'lucide-react';
import { noticeDetails } from '@/lib/dummydata';
import BackButton from '@/components/common/back-button';

type NoticeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NoticeDetailPage({
  params,
}: NoticeDetailPageProps) {
  const { id } = await params;

  const notice = noticeDetails?.find((notice) => notice?.id === id);

  if (!notice) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="rounded-xl bg-white px-12 py-10 text-center shadow-md">
          <p className="text-lg font-semibold text-neutral-800">
            공지사항을 찾을 수 없습니다.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            목록으로 돌아가 다시 시도해 주세요.
          </p>
          <Button className="mt-6" variant="default" asChild>
            <Link href="/notice">공지 목록 보기</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col gap-6 bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16">
        <BackButton link="/notice" />
        <div className="flex flex-col rounded-xl bg-white px-12 py-6">
          <div className="flex flex-col p-6">
            <span className="text-xl font-semibold">
              {notice?.isFixed && <span>📌</span>} {notice?.title}
            </span>
            <span className="flex items-center gap-1 self-end text-sm text-neutral-600">
              <CalendarDays stroke="#a3a3a3" width={15} height={15} />
              {notice?.createdAt && format(notice.createdAt, 'yyyy.MM.dd')}
            </span>
          </div>

          <div className="w-full border-y px-6 py-10 whitespace-pre-line">
            {notice?.content}
          </div>

          <div className="flex w-full flex-col items-end gap-2 px-6 py-3">
            {notice?.files?.map((file: string, index: number) => (
              <div key={file ?? index} className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">{file}</span>
                <Download width={15} height={15} className="cursor-pointer" />
                <Button
                  className="ml-4 h-7 text-xs font-medium"
                  variant="default"
                >
                  미리보기
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
