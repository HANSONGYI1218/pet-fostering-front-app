import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

import { handleCopyLink } from '../utils';

const writeTextMock = vi.fn();
const toastMock = vi.fn();

vi.mock('sonner', () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

const originalNavigator = globalThis.navigator;

beforeEach(() => {
  writeTextMock.mockReset();
  toastMock.mockReset();

  Object.defineProperty(globalThis, 'navigator', {
    value: {
      ...originalNavigator,
      clipboard: {
        writeText: writeTextMock,
      },
    },
    configurable: true,
  });
});

afterEach(() => {
  Object.defineProperty(globalThis, 'navigator', {
    value: originalNavigator,
    configurable: true,
  });
});

describe('handleCopyLink', () => {
  it('클립보드 복사 성공 시 토스트를 노출한다', async () => {
    writeTextMock.mockResolvedValue(undefined);

    await handleCopyLink('https://example.com');

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com');
    expect(toastMock).toHaveBeenCalledWith('링크를 복사했어요!');
  });

  it('클립보드 복사 실패 시 에러 토스트를 노출한다', async () => {
    writeTextMock.mockRejectedValue(new Error('failed'));

    await handleCopyLink('https://example.com');

    expect(writeTextMock).toHaveBeenCalledWith('https://example.com');
    expect(toastMock).toHaveBeenCalledWith(
      '잠시만요!! 다시 한번 더 시도해주세요.',
    );
  });
});
