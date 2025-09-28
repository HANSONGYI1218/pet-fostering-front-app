import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('카카오 로그인 버튼을 포함하지 않는다', () => {
    render(<Home />);

    expect(
      screen.queryByRole('button', { name: /카카오로 시작하기/i }),
    ).not.toBeInTheDocument();
  });
});
