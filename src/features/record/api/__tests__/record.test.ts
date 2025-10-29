import { vi } from 'vitest';
import { FosterState } from '@/entities/animal/animal';

import { fetchRecordAnimals, fetchRecordDetail } from '../record';

vi.mock('@/shared/api/config', () => ({
  resolveEndpoint: (path: string) => `https://example.com${path}`,
}));

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  fetchMock.mockReset();
});

describe('record api', () => {
  it('maps animals list from api response', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          items: [
            {
              id: 'animal-1',
              name: '초코',
              type: 'DOG',
              breed: '푸들',
              birthDate: '2025-01-01T00:00:00.000Z',
              gender: 'FEMALE',
              images: ['https://example.com/1.jpg'],
              fosterDuration: 10,
              state: 'IN_PROGRESS',
              matchId: 'match-1',
            },
          ],
        }),
      }) as Response,
    );

    const animals = await fetchRecordAnimals();

    expect(animals).toHaveLength(1);
    expect(animals[0]).toMatchObject({
      id: 'animal-1',
      foster_match_id: 'match-1',
      foster_duration: 10,
      state: FosterState.IN_PROGRESS,
    });
  });

  it('maps record detail from api response', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: true,
        json: async () => ({
          id: 'animal-1',
          info: {
            id: 'animal-1',
            state: 'IN_PROGRESS',
            createdAt: '2025-09-01T00:00:00.000Z',
            organization: {
              id: 'org-1',
              name: '퍼디즈 센터',
              phoneNumber: '02-000-0000',
              zipcode: '01234',
              address: '서울',
              addressDetail: '101호',
              email: 'hello@example.com',
            },
            animal: {
              name: '초코',
              type: 'DOG',
              breed: '푸들',
              birthDate: '2023-01-01T00:00:00.000Z',
              gender: 'FEMALE',
              remark: '친화적',
              images: ['https://example.com/1.jpg'],
            },
          },
          records: [
            {
              id: 'record-1',
              content: '테스트',
              healthNote: '정상',
              createdAt: '2025-09-02T00:00:00.000Z',
              updatedAt: '2025-09-02T01:00:00.000Z',
              images: ['https://example.com/rec.jpg'],
            },
          ],
        }),
      }) as Response,
    );

    const detail = await fetchRecordDetail('animal-1');

    expect(detail.info.id).toBe('animal-1');
    expect(detail.records[0]).toMatchObject({
      id: 'record-1',
      health_note: '정상',
    });
  });

  it('fetchRecordAnimals가 실패하면 예외를 전달한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: false,
        status: 500,
      }) as Response,
    );

    await expect(fetchRecordAnimals()).rejects.toThrow(
      '기록 동물 목록 요청 실패: 500',
    );
  });

  it('fetchRecordDetail이 실패하면 예외를 전달한다', async () => {
    fetchMock.mockResolvedValueOnce(
      Promise.resolve({
        ok: false,
        status: 404,
      }) as Response,
    );

    await expect(fetchRecordDetail('unknown')).rejects.toThrow(
      '기록 상세 요청 실패: 404',
    );
  });
});
