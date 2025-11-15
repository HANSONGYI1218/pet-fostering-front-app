import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnimalTile from '../animal-tile';

describe('AnimalTile', () => {
  it('렌더링 테스트', () => {
    const animal = {
      id: 'animal-1',
      name: '댕댕이',
      size: 'MEDIUM',
      type: 'DOG',
      breed: '믹스',
      gender: 'MALE',
      current_foster_start_date: new Date(2024, 0, 1),
      current_foster_end_date: new Date(2024, 0, 31),
      state: 'WAITING',
      isEmergency: false,
      animal_condition: {},
      organization: {
        name: '동물보호소',
        address: '서울시',
        addressDetail: '강남구 123',
      },
    };

    render(<AnimalTile animal={animal} />);

    expect(screen.getByText('댕댕이')).toBeInTheDocument();
    expect(screen.getByText(/강아지/)).toBeInTheDocument();
    expect(screen.getByText(/믹스/)).toBeInTheDocument();
    expect(screen.getByText('2024.01.01~2024.01.31')).toBeInTheDocument();
    expect(screen.getByText('동물보호소')).toBeInTheDocument();
    expect(screen.getByText(/서울시강남구 123/)).toBeInTheDocument();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/foster-list/animal-1');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
