import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pushMock = vi.fn();
const usePathnameMock = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/lib/auth/use-auth-claims', () => ({
  useAuthClaims: vi.fn(),
}));

import TopBar from '../top-bar';
import { useAuthClaims } from '@/lib/auth/use-auth-claims';

const mockUseAuthClaims = useAuthClaims as unknown as vi.Mock;

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pushMock.mockReset();
    usePathnameMock.mockReturnValue('/');
    mockUseAuthClaims.mockReturnValue({ claims: null, isAuthenticated: false });
  });

  it('비로그인 사용자는 로그인 버튼을 본다', () => {
    render(<TopBar />);

    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument();
  });

  it('로그인 사용자는 프로필 정보를 확인할 수 있다', async () => {
    mockUseAuthClaims.mockReturnValue({
      claims: {
        userId: 'user-1',
        displayName: '퍼디',
        avatarUrl: 'https://example.com/avatar.png',
      },
      isAuthenticated: true,
    });

    render(<TopBar />);

    expect(screen.getAllByTestId('user-label')[0]).toHaveTextContent('퍼디');
    expect(screen.getByAltText('사용자 프로필 사진')).toHaveAttribute(
      'src',
      expect.stringContaining('https://example.com/avatar.png'),
    );
    await userEvent.click(screen.getByRole('button', { name: '로그아웃' }));
    expect(pushMock).toHaveBeenCalledWith('/auth/logout/callback');
  });

  it('모바일 메뉴를 열고 닫을 수 있다', async () => {
    render(<TopBar />);

    await userEvent.click(screen.getByRole('button', { name: '메뉴 열기' }));
    expect(
      screen.getByRole('navigation', { name: '모바일 메뉴' }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: '모바일 메뉴 닫기' }),
    );

    expect(
      screen.queryByRole('navigation', { name: '모바일 메뉴' }),
    ).not.toBeInTheDocument();
  });

  it('현재 경로에 해당하는 메뉴에 포커스를 표시한다', () => {
    usePathnameMock.mockReturnValue('/community');

    render(<TopBar />);

    const activeLinks = screen.getAllByRole('link', { current: 'page' });
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0]).toHaveAttribute('href', '/community');
  });
});
