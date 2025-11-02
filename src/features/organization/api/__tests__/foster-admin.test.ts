import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createOrganizationAnimal,
  createOrganizationFosterRecord,
  deleteOrganizationAnimal,
  deleteOrganizationFosterRecord,
  updateOrganizationAnimal,
  updateOrganizationFosterRecord,
} from '../foster-admin';
import { FosterState } from '@/entities/animal/animal';

const mockFetch = vi.fn();

vi.stubGlobal('fetch', mockFetch);

const buildResponse = (overrides: Partial<Response> = {}) =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        id: 'record-1',
        animalId: 'animal-1',
        date: '2024-03-01T00:00:00.000Z',
        content: 'content',
        healthNote: 'note',
        createdAt: '2024-03-01T00:00:00.000Z',
        updatedAt: '2024-03-01T00:00:00.000Z',
        images: [{ id: 'img-1', url: 'https://cdn/image' }],
      }),
    ...overrides,
  } as Response);

describe('foster-admin api', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('createOrganizationAnimal maps payload and issues POST request', async () => {
    mockFetch.mockImplementation(() => buildResponse());

    await createOrganizationAnimal('token', {
      name: '두부',
      organizationId: 'org-1',
      shared: true,
      status: FosterState.IN_PROGRESS,
      type: 'DOG',
      size: 'SMALL',
      gender: 'FEMALE',
      breed: '믹스',
      birthDate: new Date('2023-01-01'),
      introduction: '소개',
      remark: '특이사항',
      isEmergency: true,
      emergencyReason: '치료 필요',
      images: ['blob:should-skip', 'https://cdn/image-1'],
      healthTags: ['VACCINATED'],
      personalityTags: ['QUIET'],
      environmentTags: ['QUIET_ENVIRONMENT'],
      specialNoteTags: ['MEDICATION_REQUIRED'],
      isFosterCondition: true,
      currentFosterStartDate: '2024-01-01',
      currentFosterEndDate: '2024-02-01',
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, options] = mockFetch.mock.calls[0]!;
    expect(options?.method).toBe('POST');
    expect(options?.headers).toBeInstanceOf(Headers);
    const headers = options?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(JSON.parse(String(options?.body))).toMatchObject({
      name: '두부',
      orgId: 'org-1',
      status: 'IN_PROGRESS',
      images: ['https://cdn/image-1'],
      emergency: true,
      emergencyReason: '치료 필요',
      birthDate: '2023-01-01',
      currentFosterStartDate: '2024-01-01T00:00:00.000Z',
      currentFosterEndDate: '2024-02-01T00:00:00.000Z',
    });
  });

  it('updateOrganizationAnimal uses PATCH and includes arrays only when provided', async () => {
    const json = vi.fn().mockResolvedValue({});
    mockFetch.mockImplementation(() =>
      buildResponse({
        json,
      }),
    );

    const result = await updateOrganizationAnimal('token', 'animal-1', {
      name: '두부',
      organizationId: 'org-1',
      images: [],
      healthTags: [],
    });

    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/foster/animals/animal-1');
    expect(options?.method).toBe('PATCH');
    expect(JSON.parse(String(options?.body))).toMatchObject({
      name: '두부',
      images: [],
      healthTags: [],
    });
    expect(result).toBeUndefined();
    expect(json).not.toHaveBeenCalled();
  });

  it('deleteOrganizationAnimal issues DELETE with authorization header', async () => {
    mockFetch.mockImplementation(() => buildResponse());

    await deleteOrganizationAnimal('token', 'animal-1');

    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/foster/animals/animal-1');
    expect(options?.method).toBe('DELETE');
    expect(options?.headers).toBeInstanceOf(Headers);
    const headers = options?.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer token');
  });

  it('createOrganizationFosterRecord serializes record payload', async () => {
    mockFetch.mockImplementation(() => buildResponse());

    await createOrganizationFosterRecord('token', 'animal-1', {
      date: new Date('2024-03-01'),
      content: '식사 완료',
      healthNote: '정기 검진 예정',
      images: ['https://cdn/img-1'],
    });

    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/foster/animals/animal-1/records');
    expect(options?.method).toBe('POST');
    expect(JSON.parse(String(options?.body))).toEqual({
      date: '2024-03-01',
      content: '식사 완료',
      healthNote: '정기 검진 예정',
      images: ['https://cdn/img-1'],
    });
  });

  it('updateOrganizationFosterRecord issues PATCH request', async () => {
    mockFetch.mockImplementation(() => buildResponse());

    await updateOrganizationFosterRecord('token', 'animal-1', 'record-1', {
      date: '2024-03-02',
      healthNote: '',
    });

    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/foster/animals/animal-1/records/record-1');
    expect(options?.method).toBe('PATCH');
    expect(JSON.parse(String(options?.body))).toEqual({
      date: '2024-03-02',
      content: undefined,
      healthNote: undefined,
      images: [],
    });
  });

  it('deleteOrganizationFosterRecord issues DELETE request', async () => {
    mockFetch.mockImplementation(() => buildResponse());

    await deleteOrganizationFosterRecord('token', 'animal-1', 'record-1');

    const [url, options] = mockFetch.mock.calls[0]!;
    expect(url).toContain('/foster/animals/animal-1/records/record-1');
    expect(options?.method).toBe('DELETE');
  });
});
