import { useCallback, useRef } from 'react';

import {
  IMAGE_UPLOAD_SCOPE,
  isLocalImage,
  resolveImageUploads,
  type ResolveImageUploadResult,
} from '@/shared/lib/image-upload';

type UseImageUploadStoreOptions = {
  scope?: string;
  maxCount: number;
};

type AddFilesInput = FileList | File[];

const toFileArray = (files: AddFilesInput): File[] => {
  if ('length' in files && typeof (files as FileList).item === 'function') {
    return Array.from(files);
  }
  return Array.from(files);
};

export const useImageUploadStore = ({
  scope = IMAGE_UPLOAD_SCOPE,
  maxCount,
}: UseImageUploadStoreOptions) => {
  const fileMapRef = useRef<Map<string, File>>(new Map());

  const clear = useCallback(() => {
    fileMapRef.current.forEach((_, preview) => {
      if (isLocalImage(preview)) {
        URL.revokeObjectURL(preview);
      }
    });
    fileMapRef.current.clear();
  }, []);

  const addFiles = useCallback(
    (files: AddFilesInput, current: string[] = []) => {
      const remaining = maxCount - current.length;
      if (remaining <= 0) {
        return current;
      }

      const selected = toFileArray(files).slice(0, remaining);
      if (selected.length === 0) {
        return current;
      }

      const previews = selected.map((file) => {
        const previewUrl = URL.createObjectURL(file);
        fileMapRef.current.set(previewUrl, file);
        return previewUrl;
      });

      return [...current, ...previews];
    },
    [maxCount],
  );

  const removeFile = useCallback((target: string, current: string[] = []) => {
    if (isLocalImage(target)) {
      fileMapRef.current.delete(target);
      URL.revokeObjectURL(target);
    }
    return current.filter((value) => value !== target);
  }, []);

  const resolve = useCallback(
    async (token: string, images: string[]): Promise<ResolveImageUploadResult> => {
      const result = await resolveImageUploads({
        token,
        scope,
        images,
        fileMap: fileMapRef.current,
      });

      if (result.uploadedCount > 0) {
        clear();
      }

      return result;
    },
    [clear, scope],
  );

  return {
    addFiles,
    removeFile,
    clear,
    resolve,
  };
};
