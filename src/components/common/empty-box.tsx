import { Card } from '../ui/card';
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
        src="/images/foster-register.png"
        width={145}
        height={145}
        alt="foster-register"
      />
      <span>{text}</span>
    </Card>
  );
}
