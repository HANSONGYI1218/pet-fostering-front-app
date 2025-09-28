import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FosterConditionCard from '../foster-condition-card';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
} from '@/types/animal/animal';
import { FILTER_ALL_VALUE } from '@/constants/filter';

beforeAll(() => {
  (Element.prototype as unknown as { hasPointerCapture?: () => boolean }).hasPointerCapture ??=
    () => false;
  (Element.prototype as unknown as { releasePointerCapture?: () => void }).releasePointerCapture ??=
    () => {};
  (Element.prototype as unknown as { scrollIntoView?: (arg?: unknown) => void }).scrollIntoView ??=
    () => {};
});

describe('FosterConditionCard', () => {
  it('옵션 셀렉트를 통해 조건을 변경할 수 있다', async () => {
    const user = userEvent.setup();
    const setAnimalType = vi.fn();
    const setAnimalSize = vi.fn();
    const setAnimalGender = vi.fn();

    render(
      <FosterConditionCard
        animalType={FILTER_ALL_VALUE}
        animalSize={FILTER_ALL_VALUE}
        animalGender={FILTER_ALL_VALUE}
        setAnimalType={setAnimalType}
        setAnimalSize={setAnimalSize}
        setAnimalGender={setAnimalGender}
      />,
    );

    await user.click(screen.getByRole('button', { name: '옵션' }));

    await user.click(screen.getByLabelText('종류'));
    await user.click(
      await screen.findByRole('option', { name: '고양이' }),
    );

    expect(setAnimalType).toHaveBeenCalledWith(AnimalType.CAT);

    await user.click(screen.getByLabelText('사이즈'));
    await user.click(
      await screen.findByRole('option', { name: '중형' }),
    );

    expect(setAnimalSize).toHaveBeenCalledWith(AnimalSize.MEDIUM);

    await user.click(screen.getByLabelText('성별'));
    await user.click(
      await screen.findByRole('option', { name: '여' }),
    );

    expect(setAnimalGender).toHaveBeenCalledWith(AnimalGender.FEMALE);
  });
});
