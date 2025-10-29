import { GoogleLoginButton } from '@/features/auth/ui/googlo-login-button';
import { KakaoLoginButton } from '@/features/auth/ui/kakao-login-button';
import Image from 'next/image';

const containerClassName =
  'flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6';
const panelClassName =
  'flex w-full max-w-md flex-col items-center gap-12 rounded-2xl bg-white p-10 text-center shadow-lg';

export default function LoginPage() {
  return (
    <section className={containerClassName}>
      <div className={panelClassName}>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-xl font-semibold">로그인</h1>
          <span className="text-muted-foreground">
            간편 로그인으로 빠르게 이용해보세요!
          </span>
        </div>
        <Image
          src="/images/login/welcome.png"
          width={210}
          height={210}
          alt="welcome"
        />{' '}
        <div className="flex w-full flex-col gap-3">
          <KakaoLoginButton />
          <GoogleLoginButton />
        </div>
      </div>
    </section>
  );
}
