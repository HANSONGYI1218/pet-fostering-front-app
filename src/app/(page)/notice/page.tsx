import { NoticeContainer } from '@/components/notice/notice-container';
import { noticeList } from '@/lib/dummydata';

export default async function NoticePage() {
  const notices = noticeList;

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold md:text-4xl">공지사항</h1>
          <span className="text-base text-neutral-700 md:text-lg">
            퍼디즈의 다양한 공지를 확인해보세요
          </span>
        </div>
        <NoticeContainer notices={notices} />
      </div>
    </main>
  );
}
