import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center h-7 justify-center rounded-full border px-3 py-0.5 text-sm font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[#D0EFE0] text-black [a&]:hover:bg-[#D0EFE0]/90', //연한 초록
        secondary:
          'border-transparent bg-[#FFF2C9] text-black [a&]:hover:bg-[#FFF2C9]/90', // 연한 노랑
        destructive:
          'border-transparent bg-[#FDE8E8] text-black [a&]:hover:bg-[#FDE8E8]/90', // 연한 핑크
        outline: 'text-black border border-black bg-white',
        outline_none: 'border-none text-black',
        red: 'bg-[#EA1B1B]/80 text-white rounded-lg h-10 border-none text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
