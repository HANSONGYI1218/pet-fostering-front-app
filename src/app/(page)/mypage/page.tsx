import { Suspense } from 'react';

import MypageContainer from '@/components/mypage/mypage-container';

const MypageFallback = () => (
  <div className="flex w-full justify-center py-16 text-neutral-500">
    마이페이지를 불러오는 중입니다...
  </div>
);

export default function ProfilePage() {
  return (
    <main className="bg-neutral-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col gap-12 pt-20 pb-40">
        <Suspense fallback={<MypageFallback />}>
          <MypageContainer />
        </Suspense>
      </div>
    </main>
  );
}
