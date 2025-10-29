import { Card } from '@/shared/ui/card';
import Image from 'next/image';

export default function EmptyBox({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  return (
    <Card className={`w-full items-center justify-center ${className} `}>
      <Image
        src="/images/white-dog1.png"
        width={145}
        height={145}
        alt="white-dog1"
      />
      <span>{text}</span>
    </Card>
  );
}
