import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Input } from '../ui/input';

type SearchBoxProps = {
  placeholder: string;
  className?: string;
  onChangeValue: (state: string) => void;
};

export default function SearchBox({
  placeholder,
  className,
  onChangeValue,
}: SearchBoxProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
      <Input
        type="search"
        inputMode="search"
        onChange={(event) => onChangeValue(event.target.value)}
        placeholder={placeholder}
        className="w-full pl-9"
      />
    </div>
  );
}
