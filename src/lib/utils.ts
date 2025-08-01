import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDDay(createdAt: Date): string {
  const today = new Date();
  // 날짜만 비교하도록 시간 제거
  const createdDate = new Date(createdAt.toDateString());
  const todayDate = new Date(today.toDateString());

  const diffMs = todayDate.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays.toString();
}
