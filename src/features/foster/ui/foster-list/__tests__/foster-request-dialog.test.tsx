import type { ReactElement, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/use-auth-claims', () => ({
  useAuthClaims: vi.fn(),
}));

vi.mock('@/shared/ui/dialog', async () => {
  const React = await import('react');
  const { cloneElement } = React;

  return {
    __esModule: true,
    Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
    DialogTrigger: ({
      children,
      disabled,
    }: {
      children: ReactElement;
      disabled?: boolean;
    }) => cloneElement(children, { disabled }),
    DialogContent: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    DialogHeader: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    DialogTitle: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    DialogFooter: ({ children }: { children: ReactNode }) => (
      <div>{children}</div>
    ),
    DialogClose: ({ children }: { children: ReactElement }) => children,
  };
});

import FosterRequestDialog from '../foster-request-dialog';
import { useAuthClaims } from '@/lib/auth/use-auth-claims';

const mockUseAuthClaims = useAuthClaims as unknown as vi.Mock;

describe('FosterRequestDialog', () => {
  beforeEach(() => {
    mockUseAuthClaims.mockReset();
  });

  it('로그인하지 않은 경우 배지를 보여주고 버튼을 비활성화한다', () => {
    mockUseAuthClaims.mockReturnValue({ claims: null, isAuthenticated: false });

    render(<FosterRequestDialog name="몽실" isFosterCondition={false} />);

    expect(screen.getByText(/로그인이 필요합니다/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /임보 요청하기/i }),
    ).toBeDisabled();
  });

  it('로그인한 경우 배지를 숨기고 요청 버튼을 활성화한다', () => {
    mockUseAuthClaims.mockReturnValue({
      claims: { userId: 'user-1', displayName: null, avatarUrl: null },
      isAuthenticated: true,
    });

    render(<FosterRequestDialog name="몽실" isFosterCondition={false} />);

    expect(screen.queryByText(/로그인이 필요합니다/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /임보 요청하기/i }),
    ).not.toBeDisabled();
    const confirmButton = screen
      .getAllByRole('button', { name: /요청하기/i })
      .pop();

    expect(confirmButton).toBeDisabled();
  });

  it('임보 조건을 만족하면 요청하기 버튼이 활성화된다', () => {
    mockUseAuthClaims.mockReturnValue({
      claims: { userId: 'user-1', displayName: null, avatarUrl: null },
      isAuthenticated: true,
    });

    render(<FosterRequestDialog name="몽실" isFosterCondition />);

    const confirmButton = screen
      .getAllByRole('button', { name: /요청하기/i })
      .pop();

    expect(confirmButton).not.toBeDisabled();
  });
});
