import { describe, expect, it, vi, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';

const renderStub = vi.fn();

vi.mock('@/features/mypage/ui/mypage-container', () => ({
  __esModule: true,
  default: (props: unknown) => {
    renderStub(props);
    return null;
  },
}));

vi.mock('@/features/mypage/lib/mypage-steps', async () => {
  const actual = await vi.importActual<
    typeof import('@/features/mypage/lib/mypage-steps')
  >('@/features/mypage/lib/mypage-steps');
  return {
    ...actual,
    isMypageStep: actual.isMypageStep,
  };
});

describe('ProfilePage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('awaits searchParams before resolving tab', async () => {
    const { default: ProfilePage } = await import('./page');

    const element = await ProfilePage({
      searchParams: Promise.resolve({ tab: 'record' }),
    });

    render(element);

    expect(renderStub).toHaveBeenCalledWith(
      expect.objectContaining({ initialStep: 'record' }),
    );
  });

  it('falls back to profile when tab is missing', async () => {
    const { default: ProfilePage } = await import('./page');

    const element = await ProfilePage({
      searchParams: Promise.resolve({}),
    });

    render(element);

    expect(renderStub).toHaveBeenCalledWith(
      expect.objectContaining({ initialStep: 'profile' }),
    );
  });
});
