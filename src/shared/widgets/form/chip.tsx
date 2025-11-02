import { Check, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

type ChipProps = {
  value: string;
  isSelected: boolean; // boolean으로 바로 받음
  onToggle: () => void; // 클릭 시 토글 함수
};

export default function Chip({ value, isSelected, onToggle }: ChipProps) {
  return (
    <Button
      variant={isSelected ? 'outline_green' : 'outline'}
      onClick={onToggle}
      className={cn(
        'flex gap-1 rounded-full font-normal text-neutral-700 hover:text-black',
        isSelected && 'border-2',
      )}
    >
      {isSelected ? <Check strokeWidth={4} stroke="#00592d" /> : <Plus />}
      {value}
    </Button>
  );
}
