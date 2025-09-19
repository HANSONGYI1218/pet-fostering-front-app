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

export function formatAnimalAge(birthDate: Date): string {
  const now = new Date();

  // 년, 월 계산
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();

  // 월이 음수면 연에서 차감하고, 월 계산 보정
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0 && months > 0) {
    return `${months}개월`;
  } else if (months === 0) {
    return `${years}년`;
  } else {
    return `${years}년 ${months}개월`;
  }
}

// 1️⃣ 임보 전체 기간 (일 단위)
export function fosterTotalDuration(start_date: Date, end_date: Date): number {
  const totalDays = Math.ceil(
    (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24),
  );
  return totalDays;
}

// 1️⃣ 임보 남은 기간 (일 단위)
export function fosterRemaingDuration(end_date: Date): number {
  const today = new Date();

  const remainingDays = Math.max(
    0,
    Math.ceil((end_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
  );
  return remainingDays;
}
