import { KakaoLoginButton } from '@/components/auth/kakao-login-button';

const containerClassName =
  'flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6';
const panelClassName =
  'flex w-full max-w-md flex-col items-center gap-6 rounded-2xl bg-white p-10 text-center shadow-lg';

export default function LoginPage() {
  return (
    <section className={containerClassName}>
      <div className={panelClassName}>
        <KakaoLoginButton />
      </div>
    </section>
  );
}
