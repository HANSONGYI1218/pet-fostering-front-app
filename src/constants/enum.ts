import {
  ANIMAL_AGE,
  ANIMAL_ENVIRONMENT,
  ANIMAL_HEALTH,
  ANIMAL_PERIOD,
  ANIMAL_PERSONALITYS,
  ANIMAL_SPECIAL_NOTES,
} from '@/types/animal-condition/animal-condition';
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
  [FosterState.IN_PROGRESS]: '임시보호 전',
  [FosterState.FOSTERED]: '임시보호 중',
  [FosterState.ADOPTED]: '입양 중',
};

export const ANIMAL_AGE_LABEL_KO: Record<ANIMAL_AGE, string> = {
  [ANIMAL_AGE.JUVENILE]: '2년 미만',
  [ANIMAL_AGE.ADULT]: '2년 이상 ~ 8년 미만',
  [ANIMAL_AGE.SENIOR]: '8년 이상',
};

export const ANIMAL_PERSONALITYS_LABEL_KO: Record<ANIMAL_PERSONALITYS, string> =
  {
    [ANIMAL_PERSONALITYS.QUIET]: '조용함',
    [ANIMAL_PERSONALITYS.ENERGETIC]: '활발함',
    [ANIMAL_PERSONALITYS.INDEPENDENCE]: '독립적임',
    [ANIMAL_PERSONALITYS.SENSITIVITY]: '예민함',
    [ANIMAL_PERSONALITYS.FRIENDLY_WITH_PEOPLE]: '사람 친화적',
    [ANIMAL_PERSONALITYS.GOOD_WITH_OTHER_ANIMAL]: '다른 동물 친화적',
    [ANIMAL_PERSONALITYS.POTTY_TRAINING_COMPLETION]: '배변 훈련 완료',
    [ANIMAL_PERSONALITYS.NO_BITING]: '무는 버릇 없음',
  };

export const FOSTER_ENVIRONMENT_LABEL_KO: Record<ANIMAL_ENVIRONMENT, string> = {
  [ANIMAL_ENVIRONMENT.QUIET_ENVIRONMENT]: '조용한 환경',
  [ANIMAL_ENVIRONMENT.AVAILABILITY_FOR_WALKS_PLAY]: '산책/놀이 가능',
  [ANIMAL_ENVIRONMENT.FREQUENT_INTERACTION_WITH_PETS]:
    '반려동물과 자주 교감 필요',
  [ANIMAL_ENVIRONMENT.PRESENCE_OF_OTHER_ANIMAL]: '타 동물과 함께 지내는 환경',
  [ANIMAL_ENVIRONMENT.WILLINGNESS_FOR_POTTY_TRAINING]: '배변 훈련 필요',
  [ANIMAL_ENVIRONMENT.PATIENCE_WITH_BARKING_BITING]:
    '짖음/입질 훈련에 인내심 필요',
  [ANIMAL_ENVIRONMENT.CARE_FOR_SENSITIVE_OR_FEARFUL_PETS]:
    '예민하거나 겁 많은 동물 배려 필요',
  [ANIMAL_ENVIRONMENT.HOUSEHOLD_WITH_YOUNG_CHILDREN]:
    '어린아이 함께 지내는 가정 필요',
};

export const ANIMAL_HEALTH_LABEL_KO: Record<ANIMAL_HEALTH, string> = {
  [ANIMAL_HEALTH.NEUTERED]: '중성화함',
  [ANIMAL_HEALTH.VACCINATED]: '예방접종함',
  [ANIMAL_HEALTH.MICROCHIPPED]: '마이크로칩 등록함',
  [ANIMAL_HEALTH.HEARTWORM_TESTED]: '심장사상충 검사함',
  [ANIMAL_HEALTH.DEWORMED]: '구충제 투여함',
  [ANIMAL_HEALTH.FLEA_TICK_TREATED]: '벼룩/진드기 예방함',
};

export const ANIMAL_PERIOD_LABEL_KO: Record<ANIMAL_PERIOD, string> = {
  [ANIMAL_PERIOD.SHORT_TERM_FOSTER]: '1개월 미만',
  [ANIMAL_PERIOD.MID_TERM_FOSTER]: '3개월 미만',
  [ANIMAL_PERIOD.LONG_TERM_FOSTER]: '6개월 이상',
};

export const ANIMAL_SPECIAL_NOTES_LABEL_KO: Record<
  ANIMAL_SPECIAL_NOTES,
  string
> = {
  [ANIMAL_SPECIAL_NOTES.SEPARATION_ANXIETY]: '분리불안',
  [ANIMAL_SPECIAL_NOTES.MEDICATION_REQUIRED]: '약 복용 필요',
  [ANIMAL_SPECIAL_NOTES.POTTY_ACCIDENTS]: '배변 실수 있음',
  [ANIMAL_SPECIAL_NOTES.AGGRESSION_TOWARD_OTHER_ANIMALS]: '타 동물 공격성 있음',
  [ANIMAL_SPECIAL_NOTES.ONGOING_TREATMENT_OR_RECOVERY]: '치료/회복 중',
  [ANIMAL_SPECIAL_NOTES.DISABLED_OR_ILL_PETS_ACCEPTED]: '장애/질환 있음',
};
