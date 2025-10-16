import { Card } from '../ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

export default function LoginNoticeBox({
  errorMessage,
}: {
  errorMessage: string;
}) {
  return (
    <Card className="flex h-96 w-full items-center justify-center text-neutral-500">
      {errorMessage}
      <Link href="/login">
        <Button variant={'destructive'} className="w-32">
          로그인
        </Button>
      </Link>
    </Card>
  );
}
