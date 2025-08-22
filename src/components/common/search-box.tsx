import { Search } from 'lucide-react';
import { Input } from '../ui/input';

type SearchBoxProps = {
  placeholder: string;
  className?: string;
  useStateF: (state: string) => void;
};

export default function SearchBox({
  placeholder,
  className,
  useStateF,
}: SearchBoxProps) {
  return (
    <div className="text-normal hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 inline-flex h-9 cursor-pointer items-center justify-center rounded-md border bg-white px-4 py-2 font-medium whitespace-nowrap shadow-xs has-[>svg]:px-3">
      <Search stroke="#595959" />
      <Input
        onChange={(v) => useStateF(v.target.value)}
        placeholder={placeholder}
        className="border-none shadow-none"
      />
    </div>
  );
}
