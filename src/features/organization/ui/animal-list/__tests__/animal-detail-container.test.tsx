import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import AnimalDetailContainer from '../animal-detail-container';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/entities/animal/animal';
import { AnimalHealth } from '@/entities/animal-condition/animal-condition';

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}));

vi.mock('@/lib/auth/session', () => ({
  resolveStoredAccessToken: vi.fn(() => 'token'),
}));

vi.mock('sonner', () => {
  const fn = vi.fn();
  fn.success = vi.fn();
  fn.error = vi.fn();
  return { toast: fn };
});

vi.mock('@/features/organization/api/foster-admin', () => ({
  deleteOrganizationAnimal: vi.fn(),
}));

vi.mock('../animal-create-dialog', () => ({
  AnimalCreateDialog: ({ trigger }: { trigger?: React.ReactElement }) =>
    trigger ?? null,
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/shared/widgets/map/kakaomap-loader', () => ({
  default: () => <div data-testid="mock-map" />,
}));

vi.mock('@/features/record/widgets/record-chart/chart-container', () => ({
  default: () => <div data-testid="mock-chart" />,
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ alt, ...rest }: { alt?: string }) => {
    const { fill: _fill, ...imgProps } = rest as React.ComponentProps<'img'> & {
      fill?: boolean;
    };

    void _fill;

    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...imgProps} />;
  },
}));

const setupMatchMedia = () => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

const setupIntersectionObserver = () => {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;

    readonly rootMargin = '0px';

    readonly thresholds = [0];

    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });
};

const setupResizeObserver = () => {
  class MockResizeObserver implements ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();

    constructor() {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });
  Object.defineProperty(globalThis, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });
};

const baseAnimal = {
  id: 'animal-1',
  name: '두부',
  type: AnimalType.DOG,
  size: AnimalSize.SMALL,
  animalStatus: FosterState.IN_PROGRESS,
  breed: '믹스',
  birth_date: new Date('2022-01-01'),
  gender: AnimalGender.FEMALE,
  images: ['https://example.com/image.jpg'],
  introduction: '소개',
  remark: '특이사항',
  isBookmarked: false,
  current_foster_start_date: new Date('2024-01-01'),
  current_foster_end_date: new Date('2024-02-01'),
  foster_records: [],
  animal_healths: [AnimalHealth.VACCINATED],
  animal_personalitys: [],
  foster_environments: [],
  special_notes_animals: [],
  isEmergency: false,
  emergency_reason: '',
  organization: {
    id: 'org-1',
    name: '퍼디즈센터',
    address: '서울시',
    address_detail: '어딘가',
    phone_number: '010-0000-0000',
    donation_bank_name: '은행',
    donation_account_number: '123-456',
    donation_account_holder: '퍼디즈',
  },
};

describe('AnimalDetailContainer', () => {
  it('상세 정보 버튼을 반복 클릭해도 상세 페이지가 유지된다', async () => {
    const user = userEvent.setup();

    setupMatchMedia();
    setupIntersectionObserver();
    setupResizeObserver();
    render(<AnimalDetailContainer animal={baseAnimal} />);

    const detailButton = screen.getByRole('button', { name: '상세 정보' });
    const editButton = screen.getByRole('button', { name: '정보 수정하기' });

    await user.click(detailButton);
    expect(editButton).toHaveClass('hidden');

    await user.click(detailButton);
    expect(editButton).toHaveClass('hidden');
  });
});
