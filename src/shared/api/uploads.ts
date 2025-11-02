import { apiFetch } from './http';

type PresignPayload = {
  scope: string;
  fileName: string;
  contentType: string;
  fileSize: number;
};

type PresignResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
  expiresIn: number;
  contentType: string;
  method?: 'POST' | 'PUT';
  fields?: Record<string, string>;
  headers?: Record<string, string>;
};

type UploadImagesParams = {
  token: string;
  scope: string;
  files: File[];
};

const ensureSuccessfulResponse = async (
  response: Response,
  context: string,
) => {
  if (response.ok) {
    return;
  }
  const reason = await response.text().catch(() => '');
  throw new Error(`${context} 실패: ${response.status} ${reason}`.trim());
};

const requestPresignedUrl = async (
  payload: PresignPayload,
  token?: string,
): Promise<PresignResponse> => {
  const response = await apiFetch('/uploads/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    auth: 'required',
    token,
  });

  await ensureSuccessfulResponse(response, '이미지 업로드 URL 요청');
  return response.json() as Promise<PresignResponse>;
};

function toMethod(presigned: PresignResponse): 'POST' | 'PUT' {
  if (presigned.method === 'POST' || presigned.method === 'PUT') {
    return presigned.method;
  }
  const hasFields = Object.keys(presigned.fields ?? {}).length > 0;
  return hasFields ? 'POST' : 'PUT';
}

function withContentType(
  headers: Record<string, string> | undefined,
  contentType: string,
): Record<string, string> {
  const base = { ...(headers ?? {}) };
  const hasContentType = Object.keys(base).some(
    (key) => key.toLowerCase() === 'content-type',
  );
  return hasContentType ? base : { ...base, 'Content-Type': contentType };
}

export const uploadImages = async ({
  token,
  scope,
  files,
}: UploadImagesParams): Promise<string[]> => {
  if (!files.length) {
    return [];
  }

  const results: string[] = [];

  for (const file of files) {
    const presigned = await requestPresignedUrl(
      {
        scope,
        fileName: file.name,
        contentType: file.type,
        fileSize: file.size,
      },
      token,
    );

    const method = toMethod(presigned);
    const uploadResponse =
      method === 'POST'
        ? await fetch(presigned.uploadUrl, {
            method: 'POST',
            body: (() => {
              const formData = new FormData();
              Object.entries(presigned.fields ?? {}).forEach(
                ([field, value]) => {
                  formData.append(field, value);
                },
              );
              formData.append('file', file);
              return formData;
            })(),
          })
        : await fetch(presigned.uploadUrl, {
            method: 'PUT',
            headers: withContentType(presigned.headers, presigned.contentType),
            body: file,
          });

    await ensureSuccessfulResponse(uploadResponse, '이미지 업로드');
    results.push(presigned.publicUrl);
  }
  return results;
};
