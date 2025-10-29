import { describe, expect, it, vi, afterEach } from 'vitest';

const mockAnimal = {
  id: 'seed-animal-mongsil',
  name: '몽실',
  type: 'DOG',
  size: 'LARGE',
  gender: 'MALE',
  breed: '믹스',
  birth_date: '2021-01-01T00:00:00.000Z',
  status: 'WAITING',
  shared: true,
  mainImageUrl: null,
  isEmergency: false,
  euthanasia_date: null,
  isFosterCondition: false,
  emergency_reason: null,
  organization: {
    id: 'seed-org',
    name: '기관',
    address: '주소',
    address_detail: '상세',
    phone_number: '010-0000-0000',
    donation_bank_name: null,
    donation_account_number: null,
    donation_account_holder: null,
  },
  animal_healths: [],
  images: [],
  current_foster_start_date: null,
  current_foster_end_date: null,
  isBookmarked: false,
};

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: () => null,
}));

vi.mock('@/features/foster/api/foster', () => ({
  fetchFosterAnimalDetail: vi.fn().mockResolvedValue(mockAnimal),
}));

const stubComponent = () => null;

vi.mock('@/shared/widgets/navigation/back-button', () => ({
  __esModule: true,
  default: stubComponent,
}));

vi.mock('@/features/foster/ui/foster-list/animal-bookmark', () => ({
  __esModule: true,
  default: stubComponent,
}));

vi.mock('@/features/foster/ui/foster-list/animal-carousel', () => ({
  __esModule: true,
  AnimalCarousel: stubComponent,
}));

vi.mock('@/shared/ui/card', () => ({
  __esModule: true,
  Card: stubComponent,
}));

vi.mock('@/features/foster/ui/foster-list/connect-dialog', () => ({
  __esModule: true,
  default: stubComponent,
}));

vi.mock('@/features/foster/ui/foster-list/foster-request-dialog', () => ({
  __esModule: true,
  default: stubComponent,
}));

vi.mock('@/shared/ui/badge', () => ({
  __esModule: true,
  Badge: stubComponent,
}));

vi.mock('@/shared/widgets/map/kakaomap-loader', () => ({
  __esModule: true,
  default: stubComponent,
}));

vi.mock('@/shared/widgets/map/kakao-maps-script', () => ({
  __esModule: true,
  default: stubComponent,
}));

describe('FosterListDetailPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('awaits params before using id', async () => {
    const { fetchFosterAnimalDetail } = await import(
      '@/features/foster/api/foster'
    );
    const { default: FosterListDetailPage } = await import('./page');

    const paramsPromise = Promise.resolve({ id: mockAnimal.id });

    await expect(
      FosterListDetailPage({ params: paramsPromise }),
    ).resolves.toBeTruthy();
    expect(fetchFosterAnimalDetail).toHaveBeenCalledWith(mockAnimal.id);
  });
});
