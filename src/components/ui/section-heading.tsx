import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

interface Props {
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
  index?: string;
}

export function SectionHeading({ eyebrow, title, lead, tone = 'light', align = 'left', className, index }: Props) {
  const dark = tone === 'dark';
  return (
    <Reveal className={cn(align === 'center' ? 'mx-auto max-w-5xl text-center' : 'max-w-6xl', className)}>
      <div className={cn('flex items-center gap-4', align === 'center' && 'justify-center')}>
        {index && <span className={cn('eyebrow', dark ? 'text-champagne/60' : 'text-stone')}>{index}</span>}
        <span className={cn('h-px w-10', dark ? 'bg-champagne/60' : 'bg-gold-600/60')} aria-hidden />
        <p className={cn('eyebrow', dark ? 'text-champagne' : 'text-gold-600')}>{eyebrow}</p>
      </div>
      <h2
        className={cn(
          'display mt-6 text-[2.6rem] sm:text-6xl lg:text-[5.2rem]',
          dark ? 'text-ivory' : 'text-navy-900',
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            'mt-7 max-w-4xl text-base leading-relaxed sm:text-lg',
            align === 'center' && 'mx-auto',
            dark ? 'text-mist' : 'text-ink/70',
          )}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
