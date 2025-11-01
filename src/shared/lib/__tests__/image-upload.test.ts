import { describe, expect, it, vi } from 'vitest';

import { uploadImages } from '@/shared/api/uploads';
import { IMAGE_UPLOAD_SCOPE, resolveImageUploads } from '../image-upload';

vi.mock('@/shared/api/uploads', () => ({
  uploadImages: vi.fn(),
}));

const mockedUploadImages = vi.mocked(uploadImages);

describe('resolveImageUploads', () => {
  it('로컬 이미지가 없으면 업로드를 건너뛰고 원본을 반환한다', async () => {
    const images = ['https://cdn/image.png'];
    const fileMap = new Map<string, File>();

    const result = await resolveImageUploads({
      token: 'token',
      images,
      fileMap,
    });

    expect(mockedUploadImages).not.toHaveBeenCalled();
    expect(result).toEqual({ images, uploadedCount: 0 });
  });

  it('로컬 프리뷰 이미지를 업로드하고 presigned URL을 반환한다', async () => {
    const file = new File(['data'], 'pet.png', { type: 'image/png' });
    const images = ['blob:preview-1', 'https://cdn/existing.png'];
    const fileMap = new Map<string, File>([['blob:preview-1', file]]);

    mockedUploadImages.mockResolvedValueOnce(['https://cdn/uploaded.png']);

    const result = await resolveImageUploads({
      token: 'token-1',
      images,
      fileMap,
    });

    expect(mockedUploadImages).toHaveBeenCalledWith({
      token: 'token-1',
      scope: IMAGE_UPLOAD_SCOPE,
      files: [file],
    });
    expect(result).toEqual({
      images: ['https://cdn/uploaded.png', 'https://cdn/existing.png'],
      uploadedCount: 1,
    });
  });

  it('업로드 결과 개수가 일치하지 않으면 예외를 던진다', async () => {
    const file = new File(['data'], 'pet.png', { type: 'image/png' });
    const fileMap = new Map<string, File>([['blob:preview-1', file]]);
    mockedUploadImages.mockResolvedValueOnce([]);

    await expect(
      resolveImageUploads({
        token: 'token-1',
        images: ['blob:preview-1'],
        fileMap,
      }),
    ).rejects.toThrow('UPLOAD_COUNT_MISMATCH');
  });

  it('커스텀 scope 옵션이 있으면 해당 값을 presign 요청에 사용한다', async () => {
    const file = new File(['data'], 'pet.png', { type: 'image/png' });
    const images = ['blob:preview-1'];
    const fileMap = new Map<string, File>([['blob:preview-1', file]]);
    mockedUploadImages.mockResolvedValueOnce(['https://cdn/uploaded.png']);

    const { images: result } = await resolveImageUploads({
      token: 'token-2',
      scope: 'animals/community',
      images,
      fileMap,
    });

    expect(mockedUploadImages).toHaveBeenCalledWith({
      token: 'token-2',
      scope: 'animals/community',
      files: [file],
    });
    expect(result).toEqual(['https://cdn/uploaded.png']);
  });
});
