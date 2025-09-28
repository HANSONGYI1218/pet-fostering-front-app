import FosterContainer from '@/components/foster-list/foster-container';
import { dummyFosterAnimals } from '@/lib/dummydata';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function FosterListPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-screen-xl flex-col gap-12 px-6 py-16">
        <Card className="border-none bg-transparent p-0 shadow-none">
          <CardHeader className="gap-3 px-0">
            <CardTitle className="text-3xl font-bold md:text-4xl">
              임시보호를 기다리는 동물들
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground md:text-lg">
              사랑과 보살핌이 필요한 아이들을 만나보세요!
            </CardDescription>
          </CardHeader>
        </Card>
        <FosterContainer animals={dummyFosterAnimals} />
      </section>
    </main>
  );
}
