import { Buffer } from 'node:buffer';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';

vi.mock('@/lib/auth/kakao', async () => {
  const actual =
    await vi.importActual<typeof import('@/lib/auth/kakao')>(
      '@/lib/auth/kakao',
    );

  return {
    ...actual,
    redirectToKakaoLogout: vi.fn(),
  };
});

import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
  redirectToKakaoLogout,
} from '@/lib/auth/kakao';
import { AUTH_CHANGE_EVENT_NAME } from '@/lib/auth/events';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const pushMock = vi.fn();
const usePathnameMock = vi.fn(() => '/main');

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    vi.mocked(redirectToKakaoLogout).mockReset();
    usePathnameMock.mockReturnValue('/main');
  });

  const createToken = (payload: Record<string, unknown>) => {
    const encode = (value: string) =>
      Buffer.from(value, 'utf-8').toString('base64url');

    const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = encode(JSON.stringify(payload));

    return `${header}.${body}.signature`;
  };

  it('비로그인 상태에서는 로그인 버튼을 표시한다', async () => {
    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    await userEvent.click(menuButton);

    const mobileNav = screen.getByRole('navigation', { name: '모바일 메뉴' });
    expect(
      within(mobileNav).getByRole('link', { name: /로그인/ }),
    ).toBeInTheDocument();
  });

  it('메뉴를 기본 NavigationMenu로 렌더링한다', async () => {
    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const navigation = screen.getByRole('navigation', { name: '주요 메뉴' });
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveAttribute('data-radix-navigation-menu');
  });

  it('로그인 상태에서는 프로필 이미지와 닉네임, 로그아웃 버튼을 표시한다', async () => {
    window.localStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      createToken({
        sub: 'user-123',
        role: 'USER',
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    await waitFor(() =>
      expect(
        screen.getByText((content) => content.includes('퍼디')),
      ).toBeDefined(),
    );
    expect(screen.getByAltText('사용자 프로필 사진')).toHaveAttribute(
      'src',
      expect.stringContaining('https://cdn.kakao/avatar.png'),
    );
    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    await userEvent.click(menuButton);
    const mobileNav = screen.getByRole('navigation', { name: '모바일 메뉴' });
    expect(
      within(mobileNav).getByRole('button', { name: '로그아웃' }),
    ).toBeInTheDocument();
    expect(
      within(mobileNav).queryByRole('link', { name: /로그인/ }),
    ).toBeNull();
  });

  it('토큰 저장 후 커스텀 이벤트로도 상태를 갱신한다', async () => {
    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    window.localStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      createToken({
        sub: 'user-456',
        displayName: '로그인 완료',
      }),
    );

    act(() => {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT_NAME));
    });

    await waitFor(() =>
      expect(
        screen.getByText((content) => content.includes('로그인 완료')),
      ).toBeDefined(),
    );
  });

  it('로그아웃 버튼 클릭 시 토큰을 제거하고 로그인 페이지로 이동한다', async () => {
    window.localStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      createToken({
        sub: 'logout-user',
        role: 'USER',
        displayName: '로그아웃',
      }),
    );
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, 'refresh-token');

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const menuButton = screen.getByRole('button', { name: '메뉴 열기' });
    await userEvent.click(menuButton);
    const mobileNav = screen.getByRole('navigation', { name: '모바일 메뉴' });
    const logoutButton = within(mobileNav).getByRole('button', {
      name: '로그아웃',
    });
    await userEvent.click(logoutButton);

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: '메뉴 열기' }),
      ).toBeInTheDocument(),
    );
    const reopenButton = screen.getByRole('button', { name: '메뉴 열기' });
    await userEvent.click(reopenButton);
    const mobileNavAfter = screen.getByRole('navigation', {
      name: '모바일 메뉴',
    });
    expect(
      within(mobileNavAfter).getByRole('link', { name: /로그인/ }),
    ).toBeInTheDocument();
    expect(window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
    expect(window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)).toBeNull();
    expect(redirectToKakaoLogout).toHaveBeenCalledTimes(1);
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('모바일 메뉴 토글 버튼으로 내비게이션을 열고 닫을 수 있다', async () => {
    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const openButton = screen.getByRole('button', { name: '메뉴 열기' });
    await userEvent.click(openButton);
    expect(
      screen.getByRole('navigation', { name: '모바일 메뉴' }),
    ).toBeInTheDocument();

    const closeButton = screen.getByRole('button', {
      name: '모바일 메뉴 닫기',
    });
    await userEvent.click(closeButton);

    await waitFor(() =>
      expect(
        screen.queryByRole('navigation', { name: '모바일 메뉴' }),
      ).not.toBeInTheDocument(),
    );
  });

  it('토큰에 닉네임이 없어도 저장된 프로필로 표시한다', async () => {
    window.localStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      createToken({
        sub: 'user-without-profile',
      }),
    );
    window.localStorage.setItem(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: '퍼디',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    await waitFor(() =>
      expect(
        screen.getByText((content) => content.includes('퍼디')),
      ).toBeDefined(),
    );
    expect(screen.getByAltText('사용자 프로필 사진')).toHaveAttribute(
      'src',
      expect.stringContaining('https://cdn.kakao/avatar.png'),
    );
  });

  it('활성화된 메뉴에만 paw 아이콘을 표시한다', async () => {
    usePathnameMock.mockReturnValue('/community');

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const pawIcons = screen.getAllByAltText('paw');
    expect(pawIcons).toHaveLength(1);
    expect(pawIcons[0].closest('a')).toHaveAttribute('href', '/community');
  });
});
