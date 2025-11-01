import { uploadImages } from '@/shared/api/uploads';

export const IMAGE_UPLOAD_SCOPE = 'animals';

export const isLocalImage = (value: string) => value.startsWith('blob:');

type ResolveImageUploadParams = {
  token: string;
  scope?: string;
  images: string[];
  fileMap: Map<string, File>;
};

export type ResolveImageUploadResult = {
  images: string[];
  uploadedCount: number;
};

export const resolveImageUploads = async ({
  token,
  scope = IMAGE_UPLOAD_SCOPE,
  images,
  fileMap,
}: ResolveImageUploadParams): Promise<ResolveImageUploadResult> => {
  const pendingEntries = images
    .filter(isLocalImage)
    .map((preview) => ({
      preview,
      file: fileMap.get(preview),
    }))
    .filter(
      (
        entry,
      ): entry is {
        preview: string;
        file: File;
      } => Boolean(entry.file),
    );

  if (pendingEntries.length === 0) {
    return { images, uploadedCount: 0 };
  }

  const files = pendingEntries.map((entry) => entry.file);
  const uploadedUrls = await uploadImages({
    token,
    scope,
    files,
  });

  if (uploadedUrls.length !== files.length) {
    throw new Error('UPLOAD_COUNT_MISMATCH');
  }

  const uploadedMap = new Map(
    pendingEntries.map(({ preview }, index) => [preview, uploadedUrls[index]]),
  );

  const resolved = images.map((image) =>
    uploadedMap.has(image) ? uploadedMap.get(image)! : image,
  );

  return {
    images: resolved,
    uploadedCount: uploadedUrls.length,
  };
};
