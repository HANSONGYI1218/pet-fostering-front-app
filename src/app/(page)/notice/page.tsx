import { NoticeContainer } from '@/features/notice/ui/list/notice-container';
import FetchErrorBox from '@/shared/widgets/feedback/fetch-error-box';
import EmptyBox from '@/shared/widgets/feedback/empty-box';
import { fetchNoticeList } from '@/features/notice/api/notice';
import { logError } from '@/shared/lib/logging';
import { createAppMetadata } from '@/shared/config/seo';

export const metadata = createAppMetadata({
  title: '공지사항 | 퍼디즈',
  description: '퍼디즈의 최신 소식과 공지사항을 확인하세요.',
  path: '/notice',
});

const renderHeading = () => (
  <div className="flex flex-col gap-2">
    <h1 className="text-2xl font-bold md:text-4xl">공지사항</h1>
    <span className="text-base text-neutral-700 md:text-lg">
      퍼디즈의 다양한 공지를 확인해보세요
    </span>
  </div>
);

export default async function NoticePage() {
  try {
    const notices = await fetchNoticeList();

    return (
      <main className="bg-neutral-50">
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          {renderHeading()}
          {notices.length === 0 ? (
            <EmptyBox
              className="min-h-[320px]"
              text="등록된 공지가 없습니다."
            />
          ) : (
            <NoticeContainer notices={notices} />
          )}
        </div>
      </main>
    );
  } catch (error) {
    logError('공지 목록을 불러오는 데 실패했습니다.', error);

    return (
      <main className="bg-neutral-50">
        <div className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          {renderHeading()}
          <FetchErrorBox errorMessage="공지사항을 불러오지 못했습니다." />
        </div>
      </main>
    );
  }
}
