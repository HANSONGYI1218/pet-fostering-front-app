import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDate = (value: Date | string | number): Date => {
  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
};

export function getDDay(createdAt: Date | string | number): string {
  const today = new Date();
  const createdDate = toDate(createdAt);

  const diffDays = Math.floor(
    Math.abs(
      (new Date(createdDate.toDateString()).getTime() -
        new Date(today.toDateString()).getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return diffDays.toString();
}

export function formatAnimalAge(birthDate: Date | string | number): string {
  const now = new Date();
  const parsedBirthDate = toDate(birthDate);

  let years = now.getFullYear() - parsedBirthDate.getFullYear();
  let months = now.getMonth() - parsedBirthDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) {
    return '1개월 미만';
  }

  if (years <= 0 && months <= 0) {
    return '1개월 미만';
  }

  if (years <= 0 && months > 0) {
    return `${months}개월`;
  }

  return `${years}살`;
}

export function fosterTotalDuration(
  startDate: Date | string | number,
  endDate: Date | string | number,
): number {
  const start = toDate(startDate);
  const end = toDate(endDate);

  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

export function fosterRemaingDuration(endDate: Date | string | number): number {
  const today = new Date();
  const end = toDate(endDate);

  return Math.max(
    0,
    Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function fosterDuration(startDate: Date | string | number): number {
  const today = new Date();
  const start = toDate(startDate);

  return Math.max(
    0,
    Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

export const normalizeKeyword = (keyword?: string): string =>
  keyword?.trim().toLowerCase() ?? '';

export const handleCopyLink = async (text: string) => {
  if (typeof window === 'undefined' || !window.navigator?.clipboard) {
    toast('잠시만요!! 다시 한번 더 시도해주세요.');
    return;
  }

  try {
    await window.navigator.clipboard.writeText(text);
    toast('링크를 복사했어요!');
  } catch {
    toast('잠시만요!! 다시 한번 더 시도해주세요.');
  }
};
