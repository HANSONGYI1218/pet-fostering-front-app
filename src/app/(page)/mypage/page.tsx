import MypageContainer from '@/features/mypage/ui/mypage-container';
import { isMypageStep } from '@/features/mypage/lib/mypage-steps';

type ProfilePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const rawTab = resolvedParams.tab;
  const tabParam = Array.isArray(rawTab)
    ? (rawTab[0] ?? null)
    : (rawTab ?? null);
  const initialStep = isMypageStep(tabParam) ? tabParam : 'profile';

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <MypageContainer initialStep={initialStep} />
      </div>
    </main>
  );
}
