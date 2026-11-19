import Image, { type ImageProps } from 'next/image';
import { media, type MediaKey } from '@/content/media.generated';

type Props = Omit<ImageProps, 'src' | 'width' | 'height' | 'placeholder' | 'blurDataURL' | 'alt'> & {
  mediaKey: MediaKey;
  alt: string;
};

/** next/image wrapper for curated Excellaa imagery with intrinsic size and blur placeholder. */
export function MediaImage({ mediaKey, alt, fill, ...rest }: Props) {
  const m = media[mediaKey];
  if (fill) {
    return <Image src={m.src} alt={alt} fill placeholder="blur" blurDataURL={m.blur} {...rest} />;
  }
  return (
    <Image src={m.src} alt={alt} width={m.width} height={m.height} placeholder="blur" blurDataURL={m.blur} {...rest} />
  );
}
