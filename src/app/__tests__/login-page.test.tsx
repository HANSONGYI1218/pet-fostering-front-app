import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/(page)/login/page';

describe('LoginPage', () => {
  it('카카오 로그인 버튼을 렌더링한다', () => {
    render(<LoginPage />);

    expect(
      screen.getByRole('button', { name: /카카오로 시작하기/i }),
    ).toBeInTheDocument();
  });
});
