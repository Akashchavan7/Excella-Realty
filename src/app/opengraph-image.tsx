import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'Excellaa Realty — Building with Ethos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logo = await readFile(path.join(process.cwd(), 'public/brand/excellaa-logo-reversed.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #05011a 0%, #0a003b 60%, #221766 100%)',
          color: '#f7f3ea',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori (next/og) requires a plain img */}
        <img src={logoSrc} width={330} height={108} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 26, letterSpacing: 8, color: '#d6b679', textTransform: 'uppercase' }}>Pune · Mumbai · Gujarat · Since 1987</div>
          <div style={{ fontSize: 92, marginTop: 18, lineHeight: 1 }}>Building with Ethos.</div>
          <div style={{ fontSize: 28, marginTop: 24, color: '#b9b4cc' }}>34+ years · 22+ projects · 50 lakh+ sq. ft. · The Autograph Collection</div>
        </div>
      </div>
    ),
    size,
  );
}
