import Script from 'next/script';
import { buildKakaoSdkUrl } from '@/lib/kakao-sdk';
import { logWarning } from '@/shared/lib/logging';

type Props = {
  onLoad?: () => void;
};

export default function KakaoMapsScript({ onLoad }: Props) {
  const kakaoSdkUrl = buildKakaoSdkUrl(process.env.NEXT_PUBLIC_MAP_KEY);

  if (!kakaoSdkUrl) {
    logWarning(
      'NEXT_PUBLIC_MAP_KEY가 설정되지 않아 Kakao Maps SDK가 로드되지 않습니다.',
    );
    return null;
  }

  return (
    <Script strategy="afterInteractive" src={kakaoSdkUrl} onLoad={onLoad} />
  );
}
