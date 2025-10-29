import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const background = '#0f172a';
const accent = '#38bdf8';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: background,
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '96px',
          gap: '24px',
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontWeight: 500,
            color: accent,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Perdiz
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 700,
              margin: 0,
            }}
          >
            임시보호 매칭 플랫폼 퍼디즈
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 400,
              color: 'rgba(226, 232, 240, 0.9)',
              lineHeight: 1.4,
            }}
          >
            임시보호자와 보호소를 빠르게 연결하는 반려동물 케어 네트워크
          </p>
        </div>
      </div>
    ),
    size,
  );
}
