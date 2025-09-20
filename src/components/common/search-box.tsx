import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

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
    <div
      className={cn(
        'text-normal hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex h-9 cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-2 font-medium whitespace-nowrap shadow-xs has-[>svg]:px-3',
        className,
      )}
    >
      <Search stroke="#595959" />
      <Input
        onChange={(event) => onChangeValue(event.target.value)}
        placeholder={placeholder}
        className="border-none shadow-none"
      />
    </div>
  );
}
