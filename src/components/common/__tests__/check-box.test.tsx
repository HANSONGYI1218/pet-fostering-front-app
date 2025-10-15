import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import CheckBox from '../check-box';

describe('CheckBox', () => {
  it('체크박스를 클릭하면 onChangeValue가 호출된다', () => {
    const handleChange = vi.fn();

    render(
      <CheckBox
        label="강아지"
        value="DOG"
        selectedValue="ALL"
        onChangeValue={handleChange}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(handleChange).toHaveBeenCalledWith('DOG');
  });

  it('라벨을 클릭해도 onChangeValue가 호출된다', () => {
    const handleChange = vi.fn();

    render(
      <CheckBox
        label="고양이"
        value="CAT"
        selectedValue="ALL"
        onChangeValue={handleChange}
      />,
    );

    fireEvent.click(screen.getByText('고양이'));

    expect(handleChange).toHaveBeenCalledWith('CAT');
  });

  it('키보드 스페이스 입력으로도 상태를 변경할 수 있다', async () => {
    const handleChange = vi.fn();

    render(
      <CheckBox
        label="토끼"
        value="RABBIT"
        selectedValue="ALL"
        onChangeValue={handleChange}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    const user = userEvent.setup();

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard('[Space]');

    expect(handleChange).toHaveBeenCalledWith('RABBIT');
  });
});
