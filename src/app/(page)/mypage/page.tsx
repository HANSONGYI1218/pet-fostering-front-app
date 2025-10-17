import MypageContainer from '@/components/mypage/mypage-container';
import { isMypageStep } from '@/components/mypage/mypage-steps';

type ProfilePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function ProfilePage({ searchParams = {} }: ProfilePageProps) {
  const rawTab = searchParams.tab;
  const tabParam = Array.isArray(rawTab) ? rawTab[0] : rawTab;
  const initialStep = isMypageStep(tabParam) ? tabParam : 'profile';

  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <MypageContainer initialStep={initialStep} />
      </div>
    </main>
  );
}
