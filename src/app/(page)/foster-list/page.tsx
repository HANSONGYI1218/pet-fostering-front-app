import FosterContainer from '@/components/foster-list/foster-container';
import { fetchFosterAnimals } from '@/lib/api/foster';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function FosterListPage() {
  const animals = await fetchFosterAnimals();

  return (
    <main className="bg-background min-h-screen">
      <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 py-16 md:gap-12">
        <Card className="border-none bg-transparent p-0 shadow-none">
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
}
