import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('@/lib/auth/use-auth-claims', () => ({
  useAuthClaims: vi.fn(),
}));

import AnimalBookmark from '../animal-bookmark';
import { useAuthClaims } from '@/lib/auth/use-auth-claims';

const mockUseAuthClaims = useAuthClaims as unknown as vi.Mock;

describe('AnimalBookmark', () => {
  beforeEach(() => {
    mockUseAuthClaims.mockReset();
  });

  it('로그인하지 않았다면 버튼을 렌더링하지 않는다', () => {
    mockUseAuthClaims.mockReturnValue({ claims: null, isAuthenticated: false });

    const { container } = render(<AnimalBookmark isBookmarked={false} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('로그인한 경우 즐겨찾기 토글을 제공하고 상태를 토글한다', () => {
    mockUseAuthClaims.mockReturnValue({
      claims: { userId: 'user-1', displayName: null, avatarUrl: null },
      isAuthenticated: true,
    });

    render(<AnimalBookmark isBookmarked={false} />);

    const button = screen.getByRole('button', { name: /즐겨찾기 토글/i });

    expect(button).toHaveAttribute('aria-pressed', 'false');

    fireEvent.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
