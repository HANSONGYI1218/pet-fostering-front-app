import { Triangle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export default function NeedLoginBadge({ className }: { className: string }) {
  return (
    <div className={`flex flex-col ${className} items-center`}>
      <Badge variant={'black'}>로그인이 필요합니다!</Badge>
      <Triangle className="h-3 w-3 -translate-y-1 rotate-180 fill-black" />
    </div>
  );
}
