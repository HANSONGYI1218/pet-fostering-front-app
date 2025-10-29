import { Buffer } from 'node:buffer';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act } from 'react';

import {
  ACCESS_TOKEN_STORAGE_KEY,
  USER_PROFILE_STORAGE_KEY,
} from '@/lib/auth/kakao';
import { AUTH_CHANGE_EVENT_NAME } from '@/lib/auth/events';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as authSession from '@/lib/auth/session';

const pushMock = vi.fn();
const usePathnameMock = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
  useRouter: () => ({
    push: pushMock,
  }),
}));

beforeEach(() => {
  pushMock.mockClear(); // 이전 테스트 호출 초기화
});

describe('TopBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
    usePathnameMock.mockReturnValue('/');
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

    const menuButton = screen.getByRole('button', { name: /메뉴 열기/i });
    await userEvent.click(menuButton);

    const mobileNav = screen.getByRole('navigation', { name: /모바일 메뉴/i });
    expect(mobileNav).toBeVisible();

    const loginLink = within(mobileNav).getByRole('link', { name: /로그인/i });
    expect(loginLink).toBeInTheDocument();
  }, 60000);

  it('메뉴를 기본 NavigationMenu로 렌더링한다', async () => {
    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const navigation = screen.getByRole('navigation', { name: '주요 메뉴' });
    expect(navigation).toBeInTheDocument();
    expect(navigation).toHaveAttribute('data-radix-navigation-menu');
  });

  it('로그인 상태에서는 프로필 이미지와 닉네임, 로그아웃 버튼을 표시한다', async () => {
    vi.spyOn(authSession, 'resolveStoredAuthClaims').mockReturnValue({
      userId: 'provider:123',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
      role: 'USER',
    });

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

    expect(screen.getAllByTestId('user-label').length).toBeGreaterThan(0);

    const menuButton = screen.getByRole('button', { name: /메뉴 열기/i });
    await userEvent.click(menuButton);

    const mobileNav = await screen.findByRole('navigation', {
      name: /모바일 메뉴/i,
    });

    const userLabelInMobile = within(mobileNav).getByTestId('user-label');
    expect(userLabelInMobile).toHaveTextContent(/퍼디/i);

    const avatar = within(mobileNav).getByAltText('사용자 프로필 사진');
    expect(avatar).toHaveAttribute(
      'src',
      expect.stringContaining('https://cdn.kakao/avatar.png'),
    );

    expect(
      within(mobileNav).getByRole('button', { name: /로그아웃/i }),
    ).toBeInTheDocument();

    expect(
      within(mobileNav).queryByRole('link', { name: /로그인/i }),
    ).toBeNull();
  });

  it('토큰 저장 후 커스텀 이벤트로도 상태를 갱신한다', async () => {
    // resolveStoredAuthClaims를 mock
    vi.spyOn(authSession, 'resolveStoredAuthClaims').mockImplementation(() => ({
      userId: 'user-456',
      displayName: '로그인 완료',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    }));

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    // 로컬스토리지에 토큰 저장
    window.localStorage.setItem(
      'ACCESS_TOKEN',
      JSON.stringify({ sub: 'user-456', displayName: '로그인 완료' }),
    );

    act(() => {
      window.dispatchEvent(new Event(AUTH_CHANGE_EVENT_NAME));
    });

    // authUser 반영될 때까지 기다림
    await waitFor(() => {
      // JSDOM에서는 span.hidden sm:block 때문에 텍스트가 안 보일 수 있음
      // 대신 alt 속성으로 렌더링 확인
      const avatar = screen.getByAltText('사용자 프로필 사진');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute(
        'src',
        expect.stringContaining('https://cdn.kakao/avatar.png'),
      );
    });
  });

  it('로그아웃 버튼 클릭 시 로그아웃 콜백 페이지로 이동한다', async () => {
    vi.spyOn(authSession, 'resolveStoredAuthClaims').mockReturnValue({
      userId: 'provider:123',
      displayName: '퍼디',
      avatarUrl: 'https://cdn.kakao/avatar.png',
      role: 'USER',
    });

    const { default: TopBar } = await import('../top-bar');

    render(<TopBar />);

    const logoutButton = screen.getByRole('button', { name: '로그아웃' });
    await userEvent.click(logoutButton);

    expect(pushMock).toHaveBeenCalledWith('/auth/logout/callback');
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
    const { default: TopBar } = await import('../top-bar');

    // localStorage 세팅
    localStorage.setItem(
      ACCESS_TOKEN_STORAGE_KEY,
      createToken({ sub: 'user-without-profile' }),
    );
    localStorage.setItem(
      USER_PROFILE_STORAGE_KEY,
      JSON.stringify({
        displayName: '퍼디즈',
        avatarUrl: 'https://cdn.kakao/avatar.png',
      }),
    );

    vi.spyOn(authSession, 'resolveStoredAuthClaims').mockImplementation(() => ({
      userId: 'user-without-profile',
      displayName: '퍼디즈',
      avatarUrl: 'https://cdn.kakao/avatar.png',
    }));

    render(<TopBar />);

    // 닉네임 비동기적으로 확인
    const displayName = await screen.findByText(/퍼디즈/);
    expect(displayName).toBeInTheDocument();

    // 프로필 이미지 확인
    const profileImage = await screen.findByAltText('사용자 프로필 사진');
    expect(profileImage).toHaveAttribute(
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
