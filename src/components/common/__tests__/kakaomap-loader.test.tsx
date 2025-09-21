import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/kakao-sdk', () => ({
  hasKakaoSdk: () => false,
  getKakao: () => undefined,
}));

import KakaoMapLoader from '../kakaomap-loader';

describe('KakaoMapLoader', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('DOM 요소에 고정된 id를 부여하지 않는다', () => {
    const { container } = render(<KakaoMapLoader address="서울" />);

    const root = container.firstElementChild as HTMLElement;

    expect(root).not.toHaveAttribute('id');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      'Kakao Maps SDK가 준비되지 않아 지도를 초기화하지 않습니다.',
    );
  });
});
