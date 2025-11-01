import { resolveEndpoint } from './config';

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
  fields: Record<string, string>;
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
  token: string,
  payload: PresignPayload,
): Promise<PresignResponse> => {
  const response = await fetch(resolveEndpoint('/uploads/images'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  await ensureSuccessfulResponse(response, '이미지 업로드 URL 요청');
  return response.json() as Promise<PresignResponse>;
};

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
    const presigned = await requestPresignedUrl(token, {
      scope,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    });

    const formData = new FormData();
    Object.entries(presigned.fields).forEach(([field, value]) => {
      formData.append(field, value);
    });
    formData.append('file', file);

    const uploadResponse = await fetch(presigned.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    await ensureSuccessfulResponse(uploadResponse, '이미지 업로드');
    results.push(presigned.publicUrl);
  }

  return results;
};
