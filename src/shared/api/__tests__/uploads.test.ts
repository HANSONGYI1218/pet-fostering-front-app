import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadImages } from '../uploads';

describe('uploadImages', () => {
  const token = 'test-token';
  const scope = 'animals';

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('요청을 presign 후 S3로 업로드하고 공개 URL을 반환한다', async () => {
    const file = new File(['meow'], 'cat.png', { type: 'image/png' });
    const fetchMock = vi
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: 'https://s3.test/animal/cat.png?signed',
          publicUrl: 'https://cdn.test/animal/cat.png',
          key: 'animals/mock-key.png',
          expiresIn: 120,
          contentType: 'image/png',
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
      } as Response);

    const urls = await uploadImages({
      token,
      scope,
      files: [file],
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'http://localhost:3001/uploads/images',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          scope,
          fileName: 'cat.png',
          contentType: 'image/png',
          fileSize: file.size,
        }),
      },
    );
    expect(fetchMock).toHaveBeenNthCalledWith(2, 'https://s3.test/animal/cat.png?signed', {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/png',
      },
      body: file,
    });
    expect(urls).toEqual(['https://cdn.test/animal/cat.png']);
  });

  it('presign 이 실패하면 에러를 던진다', async () => {
    const file = new File(['oops'], 'dog.png', { type: 'image/png' });
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 403,
      text: async () => 'forbidden',
    } as Response);

    await expect(
      uploadImages({
        token,
        scope,
        files: [file],
      }),
    ).rejects.toThrowError();
  });

  it('S3 업로드가 실패하면 에러를 던진다', async () => {
    const file = new File(['oops'], 'horse.png', { type: 'image/png' });
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: 'https://s3.test/animal/horse.png?signed',
          publicUrl: 'https://cdn.test/animal/horse.png',
          key: 'animals/horse.png',
          expiresIn: 120,
          contentType: 'image/png',
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'failed',
      } as Response);

    await expect(
      uploadImages({
        token,
        scope,
        files: [file],
      }),
    ).rejects.toThrowError();
  });
});
