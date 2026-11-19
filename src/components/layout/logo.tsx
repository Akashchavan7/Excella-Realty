import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Excellaa's existing logo. `reversed` swaps the navy wordmark to ivory for dark surfaces. */
export function Logo({ reversed = false, className }: { reversed?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="Excellaa Realty — home" className={cn('inline-block shrink-0', className)}>
      <Image
        src={reversed ? '/brand/excellaa-logo-reversed.png' : '/brand/excellaa-logo.png'}
        alt="Excellaa Realty"
        width={738}
        height={242}
        priority
        className="h-full w-auto"
      />
    </Link>
  );
}
