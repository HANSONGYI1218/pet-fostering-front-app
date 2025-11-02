import { resolveEndpoint } from '@/shared/api/config';
import { fetchJson } from '@/shared/api/http';
import { FosterState } from '@/entities/animal/animal';
import type { FosterRecord } from '@/entities/foster-record/foster-record';

type NullableDateLike = Date | string | null | undefined;

const resolveDateIso = (value: NullableDateLike): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString();
};

const resolveDateOnly = (value: NullableDateLike): string | undefined => {
  const iso = resolveDateIso(value);
  return iso ? iso.slice(0, 10) : undefined;
};

const mapFosterStateToStatus = (
  state: FosterState | null | undefined,
): 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | undefined => {
  if (state === FosterState.FOSTERED) {
    return 'COMPLETED';
  }
  if (state === FosterState.IN_PROGRESS) {
    return 'IN_PROGRESS';
  }
  return undefined;
};

const ensureToken = (token: string | null | undefined) => {
  if (!token) {
    throw new Error('인가된 사용자만 사용할 수 있는 기능입니다.');
  }
  return token;
};

const sanitizeUrls = (images: readonly string[] | undefined) =>
  (images ?? [])
    .map((value) => value?.trim?.() ?? '')
    .filter((value) => value.length > 0 && !value.startsWith('blob:'))
    .slice(0, 10);

const normalizeOptionalText = (value?: string | null) => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

type FosterRecordBaseDto = {
  id: string;
  animalId: string;
  date: string;
  content?: string | null;
  healthNote?: string | null;
  createdAt: string;
  updatedAt: string;
  images?: Array<{ id: string; url: string }>;
};

const mapFosterRecord = (dto: FosterRecordBaseDto): FosterRecord => ({
  id: dto.id,
  images: dto.images?.map((image) => image.url) ?? [],
  content: dto.content ?? '',
  health_note: dto.healthNote ?? '',
  created_at: new Date(dto.date ?? dto.createdAt),
  updated_at: new Date(dto.updatedAt ?? dto.createdAt),
});

export type OrganizationAnimalUpsertPayload = {
  name: string;
  organizationId: string;
  shared?: boolean;
  status?: FosterState | null;
  type?: string | null;
  size?: string | null;
  gender?: string | null;
  breed?: string | null;
  birthDate?: NullableDateLike;
  introduction?: string | null;
  remark?: string | null;
  isEmergency?: boolean;
  emergencyReason?: string | null;
  images?: string[];
  healthTags?: string[];
  personalityTags?: string[];
  environmentTags?: string[];
  specialNoteTags?: string[];
  isFosterCondition?: boolean;
  currentFosterStartDate?: NullableDateLike;
  currentFosterEndDate?: NullableDateLike;
};

export const createOrganizationAnimal = async (
  token: string | null | undefined,
  payload: OrganizationAnimalUpsertPayload,
) => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint('/foster/animals');

  const body = {
    name: payload.name,
    orgId: payload.organizationId,
    shared: payload.shared ?? false,
    status: mapFosterStateToStatus(payload.status ?? null),
    type: payload.type ?? undefined,
    size: payload.size ?? undefined,
    gender: payload.gender ?? undefined,
    breed: payload.breed ?? undefined,
    birthDate: resolveDateOnly(payload.birthDate),
    introduction: payload.introduction ?? undefined,
    remark: payload.remark ?? undefined,
    emergency: payload.isEmergency ?? false,
    emergencyReason: payload.emergencyReason ?? undefined,
    images: sanitizeUrls(payload.images),
    healthTags: payload.healthTags ?? undefined,
    personalityTags: payload.personalityTags ?? undefined,
    environmentTags: payload.environmentTags ?? undefined,
    specialNoteTags: payload.specialNoteTags ?? undefined,
    isFosterCondition: payload.isFosterCondition ?? undefined,
    currentFosterStartDate: resolveDateIso(payload.currentFosterStartDate),
    currentFosterEndDate: resolveDateIso(payload.currentFosterEndDate),
  };

  const response = await fetchJson(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    token: resolvedToken,
    auth: 'required',
    errorMessage: '보호 동물 등록에 실패했습니다.',
  });

  return (await response.json()) as {
    id: string;
    name: string;
    status: string;
    shared: boolean;
    orgId: string | null;
    ownerUserId: string | null;
    fosterDays: number;
    createdAt: string;
    updatedAt: string;
  };
};

export const updateOrganizationAnimal = async (
  token: string | null | undefined,
  animalId: string,
  payload: OrganizationAnimalUpsertPayload,
): Promise<void> => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint(`/foster/animals/${animalId}`);

  const body = {
    name: payload.name ?? undefined,
    shared: payload.shared ?? undefined,
    status: mapFosterStateToStatus(payload.status ?? null),
    type: payload.type ?? undefined,
    size: payload.size ?? undefined,
    gender: payload.gender ?? undefined,
    breed: payload.breed ?? undefined,
    birthDate: resolveDateOnly(payload.birthDate),
    introduction: payload.introduction ?? undefined,
    remark: payload.remark ?? undefined,
    emergency: payload.isEmergency ?? undefined,
    emergencyReason: payload.emergencyReason ?? undefined,
    images: sanitizeUrls(payload.images),
    healthTags: payload.healthTags ?? undefined,
    personalityTags: payload.personalityTags ?? undefined,
    environmentTags: payload.environmentTags ?? undefined,
    specialNoteTags: payload.specialNoteTags ?? undefined,
    isFosterCondition: payload.isFosterCondition ?? undefined,
    currentFosterStartDate: resolveDateIso(payload.currentFosterStartDate),
    currentFosterEndDate: resolveDateIso(payload.currentFosterEndDate),
  };

  await fetchJson(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    token: resolvedToken,
    auth: 'required',
    errorMessage: '보호 동물 정보를 수정하지 못했습니다.',
  });
};

export const deleteOrganizationAnimal = async (
  token: string | null | undefined,
  animalId: string,
) => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint(`/foster/animals/${animalId}`);

  const response = await fetchJson(endpoint, {
    method: 'DELETE',
    token: resolvedToken,
    auth: 'required',
    errorMessage: '보호 동물 삭제에 실패했습니다.',
  });

  return (await response.json()) as { id: string; deleted: true };
};

export type OrganizationFosterRecordPayload = {
  date: NullableDateLike;
  content?: string | null;
  healthNote?: string | null;
  images?: string[];
};

const resolveRecordDto = (payload: OrganizationFosterRecordPayload) => ({
  date: resolveDateOnly(payload.date),
  content: normalizeOptionalText(payload.content),
  healthNote: normalizeOptionalText(payload.healthNote),
  images: sanitizeUrls(payload.images),
});

export const createOrganizationFosterRecord = async (
  token: string | null | undefined,
  animalId: string,
  payload: OrganizationFosterRecordPayload,
): Promise<FosterRecord> => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint(`/foster/animals/${animalId}/records`);

  const response = await fetchJson(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resolveRecordDto(payload)),
    token: resolvedToken,
    auth: 'required',
    errorMessage: '돌봄 기록 등록에 실패했습니다.',
  });

  const dto = (await response.json()) as FosterRecordBaseDto;
  return mapFosterRecord(dto);
};

export const updateOrganizationFosterRecord = async (
  token: string | null | undefined,
  animalId: string,
  recordId: string,
  payload: OrganizationFosterRecordPayload,
): Promise<FosterRecord> => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint(
    `/foster/animals/${animalId}/records/${recordId}`,
  );

  const response = await fetchJson(endpoint, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resolveRecordDto(payload)),
    token: resolvedToken,
    auth: 'required',
    errorMessage: '돌봄 기록 수정에 실패했습니다.',
  });

  return response.json();
};

export const deleteOrganizationFosterRecord = async (
  token: string | null | undefined,
  animalId: string,
  recordId: string,
) => {
  const resolvedToken = ensureToken(token);
  const endpoint = resolveEndpoint(
    `/foster/animals/${animalId}/records/${recordId}`,
  );

  const response = await fetchJson(endpoint, {
    method: 'DELETE',
    token: resolvedToken,
    auth: 'required',
    errorMessage: '돌봄 기록 삭제에 실패했습니다.',
  });

  return (await response.json()) as {
    id: string;
    animalId: string;
    deleted: true;
  };
};
