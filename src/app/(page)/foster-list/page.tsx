import {
  fetchFosterAnimals,
  fetchMatchedAnimals,
} from '@/features/foster/api/foster';
import FosterContainer from '@/features/foster/ui/foster-list/foster-container';
import MatchedAnimalContainer from '@/features/foster/ui/foster-list/matched-container';
import { resolveServerAccessToken } from '@/lib/auth/server-session';
import { createAppMetadata } from '@/shared/config/seo';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import FetchErrorBox from '@/shared/widgets/feedback/fetch-error-box';

export const metadata = createAppMetadata({
  title: '임시보호 동물 목록 | 퍼디즈',
  description:
    '임시보호자를 기다리는 반려동물을 확인하고 새로운 인연을 찾아보세요.',
  path: '/foster-list',
});

export default async function FosterListPage() {
  try {
    const animals = await fetchFosterAnimals();
    const token = await resolveServerAccessToken();
    const matchedAnimals = token
      ? await fetchMatchedAnimals(token).catch(() => [])
      : [];

    console.log('Matched Animals:', matchedAnimals[0]); // 매칭된 동물 데이터 확인

    return (
      <main className="bg-background min-h-screen">
        <section className="mx-auto flex w-full flex-col bg-neutral-100 px-6 py-16">
          <Card className="cursor-default border-none bg-transparent p-0 shadow-none">
            <CardHeader className="gap-3 px-0">
              <CardTitle className="text-2xl font-bold md:text-4xl">
                알맞춤 매칭!
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base md:text-lg">
                나의 조건과 맞는 보호동물을 확인해보세요!
              </CardDescription>
            </CardHeader>
          </Card>
          {matchedAnimals && matchedAnimals.length > 0 && (
            <MatchedAnimalContainer animals={matchedAnimals} />
          )}
        </section>
        <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          <Card className="cursor-default border-none bg-transparent p-0 shadow-none">
            <CardHeader className="gap-3 px-0">
              <CardTitle className="text-2xl font-bold md:text-4xl">
                임시보호를 기다리는 동물들
              </CardTitle>
              <CardDescription className="text-muted-foreground text-base md:text-lg">
                사랑과 보살핌이 필요한 아이들을 만나보세요!
              </CardDescription>
            </CardHeader>
          </Card>

          <FosterContainer animals={animals} />
        </section>
      </main>
    );
  } catch {
    return (
      <main className="bg-background min-h-screen">
        <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
          <FetchErrorBox errorMessage="임보 동물 목록을 불러오지 못했습니다." />
        </section>
      </main>
    );
  }
}
