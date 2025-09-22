import { KakaoLoginButton } from '@/components/auth/kakao-login-button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-lg">
        <KakaoLoginButton />
      </div>
    </main>
  );
}
