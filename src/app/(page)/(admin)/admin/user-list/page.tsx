import { Card, CardHeader, CardTitle } from '@/shared/ui/card';
import FetchErrorBox from '@/shared/widgets/feedback/fetch-error-box';
import { createAppMetadata } from '@/shared/config/seo';
import UserContainer from '@/features/admin/ui/user-list/user-container';
import { fetchUsers } from '@/features/admin/api/user';
import { dummyUsers } from '@/features/admin/api/dummydata';

export const metadata = createAppMetadata({
  title: '임시보호 동물 목록 | 퍼디즈',
  description:
    '임시보호자를 기다리는 반려동물을 확인하고 새로운 인연을 찾아보세요.',
  path: '/foster-list',
});

export default async function UserListPage() {
  try {
    // const users = await fetchUsers();
    const users = dummyUsers;

    return (
      <main className="bg-background min-h-screen">
        <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          <Card className="cursor-default border-none bg-transparent p-0 shadow-none">
            <CardHeader className="gap-3 px-0">
              <CardTitle className="text-2xl font-bold md:text-4xl">
                사용자 정보
              </CardTitle>
            </CardHeader>
          </Card>
          <UserContainer users={users} />
        </section>
      </main>
    );
  } catch {
    return (
      <main className="bg-background min-h-screen">
        <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          <FetchErrorBox errorMessage="사용자 목록을 불러오지 못했습니다." />
        </section>
      </main>
    );
  }
}
