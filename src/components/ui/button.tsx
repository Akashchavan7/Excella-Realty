import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'group/btn relative inline-flex items-center justify-center gap-3 whitespace-nowrap font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] transition-all duration-500 ease-[var(--ease-lux)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        gold: 'bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-[0_10px_40px_-12px_rgba(234,161,0,0.55)]',
        navy: 'bg-navy-900 text-ivory hover:bg-navy-800',
        outlineLight: 'border border-ivory/35 text-ivory hover:border-champagne hover:text-champagne backdrop-blur-sm',
        outlineDark: 'border border-navy-900/25 text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-ivory',
        ghostLight: 'text-ivory/85 hover:text-champagne',
        ghostDark: 'text-navy-900 hover:text-gold-600',
      },
      size: {
        sm: 'h-10 px-5',
        md: 'h-12 px-7',
        lg: 'h-14 px-9',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'gold', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';

export { buttonVariants };
