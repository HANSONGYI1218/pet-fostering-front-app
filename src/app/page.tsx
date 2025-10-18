import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl bg-white p-10 text-center shadow-lg">
        <h1 className="text-2xl font-semibold">퍼디에 오신 것을 환영합니다</h1>
        <p className="text-sm text-neutral-600">
          로그인 페이지에서 카카오 계정으로 간편하게 시작해보세요.
        </p>
        <Button asChild variant="outline_black" className="px-6">
          <Link href="/login">로그인 페이지로 이동</Link>
        </Button>
      </div>
    </section>
  );
}
