import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadImages } from '../uploads';

const originalFetch = global.fetch;

describe('uploadImages', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('presigned POST를 이용해 이미지를 업로드한다', async () => {
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            uploadUrl: 'https://s3.example.com',
            publicUrl: 'https://cdn.example.com/file.png',
            key: 'animals/file.png',
            expiresIn: 120,
            contentType: 'image/png',
            fields: {
              key: 'animals/file.png',
              Policy: 'policy',
              'Content-Type': 'image/png',
              'x-amz-algorithm': 'AWS4-HMAC-SHA256',
              'x-amz-credential': 'credential',
              'x-amz-date': '20250101T000000Z',
              'x-amz-signature': 'signature',
            },
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        ),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));

    const file = new File(['data'], 'pet.png', { type: 'image/png' });

    const result = await uploadImages({
      token: 'token',
      scope: 'animals',
      files: [file],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);

    const [, uploadInit] = fetchMock.mock.calls[1];
    expect(uploadInit?.method).toBe('POST');
    const formData = uploadInit?.body as FormData;
    expect(formData).toBeInstanceOf(FormData);

    const entries = Array.from(formData.entries());
    expect(entries).toContainEqual(['key', 'animals/file.png']);
    expect(entries).toContainEqual(['Content-Type', 'image/png']);
    const fileEntry = entries.find(([name]) => name === 'file');
    expect(fileEntry?.[1]).toBe(file);

    expect(result).toEqual(['https://cdn.example.com/file.png']);
  });
});
