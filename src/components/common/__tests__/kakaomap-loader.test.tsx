import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/kakao-sdk', () => ({
  hasKakaoSdk: () => false,
  getKakao: () => undefined,
}));

const { logWarningSpy } = vi.hoisted(() => ({
  logWarningSpy: vi.fn(),
}));

vi.mock('@/lib/logging', () => ({
  logWarning: (...args: unknown[]) => logWarningSpy(...args),
  logError: vi.fn(),
}));

import KakaoMapLoader from '../kakaomap-loader';

describe('KakaoMapLoader', () => {
  beforeEach(() => {
    logWarningSpy.mockClear();
  });

  it('DOM 요소에 고정된 id를 부여하지 않는다', () => {
    const { container } = render(<KakaoMapLoader address="서울" />);

    const root = container.firstElementChild as HTMLElement;

    expect(root).not.toHaveAttribute('id');
    expect(logWarningSpy).toHaveBeenCalledTimes(1);
    expect(logWarningSpy).toHaveBeenCalledWith(
      'Kakao Maps SDK가 준비되지 않아 지도를 초기화하지 않습니다.',
    );
  });
});
