import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const setWindow = (value: unknown) => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    writable: true,
    value,
  });
};

describe('getSocket', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it('SSR 환경에서는 null을 반환하고 연결을 시도하지 않는다', async () => {
    const ioSpy = vi.fn();
    vi.doMock('socket.io-client', () => ({ io: ioSpy }));

    setWindow(undefined);

    const { getSocket } = await import('./socket');

    const socket = getSocket();

    expect(socket).toBeNull();
    expect(ioSpy).not.toHaveBeenCalled();
  });

  it('클라이언트 환경에서는 단일 소켓 인스턴스를 재사용한다', async () => {
    const socketStub = { id: 'client-socket', on: vi.fn(), off: vi.fn() } as const;
    const ioSpy = vi.fn(() => socketStub);
    vi.doMock('socket.io-client', () => ({ io: ioSpy }));

    setWindow({ navigator: {} });

    const { getSocket } = await import('./socket');

    const first = getSocket();
    const second = getSocket();

    expect(first).toBe(socketStub);
    expect(second).toBe(first);
    expect(ioSpy).toHaveBeenCalledTimes(1);
  });
});
