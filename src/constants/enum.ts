import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/types/animal/animal';

export const ANIMAL_GENDER_LABEL_KO: Record<AnimalGender, string> = {
  [AnimalGender.MALE]: '남',
  [AnimalGender.FEMALE]: '여',
};

export const ANIMAL_TYPE_LABEL_KO: Record<AnimalType, string> = {
  [AnimalType.DOG]: '강아지',
  [AnimalType.CAT]: '고양이',
};

export const ANIMAL_SIZE_LABEL_KO: Record<AnimalSize, string> = {
  [AnimalSize.SMALL]: '소형',
  [AnimalSize.MEDIUM]: '중형',
  [AnimalSize.LARGE]: '대형',
};

export const FOSTER_STATE_LABEL_KO: Record<FosterState, string> = {
  [FosterState.IN_PROGRESS]: '임시보호 중',
  [FosterState.FOSTERED]: '임시보호 완료',
  [FosterState.ADOPTED]: '입양 중',
};
