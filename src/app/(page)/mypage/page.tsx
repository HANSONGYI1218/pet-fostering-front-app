import MypageContainer from '@/components/mypage/mypage-container';

export default async function ProfilePage() {
  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <MypageContainer />
      </div>
    </main>
  );
}
