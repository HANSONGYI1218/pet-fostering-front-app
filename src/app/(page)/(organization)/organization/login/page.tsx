import LoginForm from '@/features/organization/ui/login/login-form';
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
          <h1 className="text-xl font-semibold">기업 로그인</h1>
        </div>
        <Image
          src="/images/login/dog-with-cat.png"
          width={210}
          height={210}
          alt="dog-with-cat"
        />
        <LoginForm />
      </div>
    </section>
  );
}
