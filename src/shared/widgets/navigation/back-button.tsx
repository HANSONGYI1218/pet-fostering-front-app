import { ChevronLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export default function BackButton({ link }: { link: string }) {
  return (
    <Link href={link}>
      <Button className="flex border-none bg-transparent text-sm text-neutral-700 shadow-none hover:bg-transparent">
        <ChevronLeft className="h-4 w-4" /> 목록으로
      </Button>
    </Link>
  );
}
