import {
  AnimalAge,
  AnimalEnvironment,
  AnimalHealth,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/types/animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalType,
  FosterState,
} from '@/types/animal/animal';
import { FosterEnvironment } from '@/types/foster-condition/foster-condition';
import { NoticeType } from '@/types/notcie/notice';

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

export const ANIMAL_AGE_LABEL_KO: Record<AnimalAge, string> = {
  [AnimalAge.JUVENILE]: '2살 미만',
  [AnimalAge.ADULT]: '8살 미만',
  [AnimalAge.SENIOR]: '8살 이상',
};

export const ANIMAL_PERSONALITY_LABEL_KO: Record<AnimalPersonality, string> = {
  [AnimalPersonality.QUIET]: '조용함',
  [AnimalPersonality.ENERGETIC]: '활발함',
  [AnimalPersonality.INDEPENDENCE]: '독립적임',
  [AnimalPersonality.SENSITIVITY]: '예민함',
  [AnimalPersonality.FRIENDLY_WITH_PEOPLE]: '사람 친화적',
  [AnimalPersonality.GOOD_WITH_OTHER_ANIMAL]: '다른 동물 친화적',
  [AnimalPersonality.POTTY_TRAINING_COMPLETION]: '배변 훈련 완료',
  [AnimalPersonality.NO_BITING]: '무는 버릇 없음',
};

export const ANIMAL_ENVIRONMENT_LABEL_KO: Record<AnimalEnvironment, string> = {
  [AnimalEnvironment.QUIET_ENVIRONMENT]: '조용한 집',
  [AnimalEnvironment.AVAILABILITY_FOR_WALKS_PLAY]: '산책/놀이 활동 필요',
  [AnimalEnvironment.FREQUENT_INTERACTION_WITH_PETS]:
    '반려동물과 자주 교감 필요',
  [AnimalEnvironment.PRESENCE_OF_OTHER_ANIMAL]: '타 동물과 함께 지내는 환경',
  [AnimalEnvironment.WILLINGNESS_FOR_POTTY_TRAINING]: '배변 훈련 지도 필요',
  [AnimalEnvironment.PATIENCE_WITH_BARKING_BITING]:
    '짖음/입질 훈련에 인내심 필요',
  [AnimalEnvironment.CARE_FOR_SENSITIVE_OR_FEARFUL_PETS]:
    '예민하거나 겁 많은 동물 배려 필요',
  [AnimalEnvironment.HOUSEHOLD_WITH_YOUNG_CHILDREN]:
    '어린아이 함께 지내는 가정 필요',
};

export const FOSTER_ENVIRONMENT_LABEL_KO: Record<FosterEnvironment, string> = {
  [AnimalEnvironment.FREQUENT_INTERACTION_WITH_PETS]:
    '반려동물과 자주 교감 가능',
  [AnimalEnvironment.WILLINGNESS_FOR_POTTY_TRAINING]: '배변 훈련 지도 가능',
  [AnimalEnvironment.AVAILABILITY_FOR_WALKS_PLAY]: '산책/놀이 활동 가능',
  [AnimalEnvironment.HOUSEHOLD_WITH_YOUNG_CHILDREN]:
    '어린아이 함께 지내는 환경',
  [AnimalEnvironment.PRESENCE_OF_OTHER_ANIMAL]: '타 동물과 함께 지내는 환경',
  [AnimalEnvironment.QUIET_ENVIRONMENT]: '조용한 집',
  [AnimalEnvironment.CARE_FOR_SENSITIVE_OR_FEARFUL_PETS]:
    '예민하거나 겁 많은 동물 배려 가능',
  [AnimalEnvironment.PATIENCE_WITH_BARKING_BITING]:
    '짖음/입질 훈련에 인내심 가능',
};

export const ANIMAL_HEALTH_LABEL_KO: Record<AnimalHealth, string> = {
  [AnimalHealth.NEUTERED]: '중성화함',
  [AnimalHealth.VACCINATED]: '예방접종함',
  [AnimalHealth.MICROCHIPPED]: '마이크로칩 등록함',
  [AnimalHealth.HEARTWORM_TESTED]: '심장사상충 검사함',
  [AnimalHealth.DEWORMED]: '구충제 투여함',
  [AnimalHealth.FLEA_TICK_TREATED]: '벼룩/진드기 예방함',
};

export const ANIMAL_PERIOD_LABEL_KO: Record<AnimalPeriod, string> = {
  [AnimalPeriod.SHORT_TERM_FOSTER]: '1개월 미만',
  [AnimalPeriod.MID_TERM_FOSTER]: '3개월 미만',
  [AnimalPeriod.LONG_TERM_FOSTER]: '3개월 이상',
};

export const ANIMAL_SPECIAL_NOTE_LABEL_KO: Record<AnimalSpecialNote, string> = {
  [AnimalSpecialNote.SEPARATION_ANXIETY]: '분리불안',
  [AnimalSpecialNote.MEDICATION_REQUIRED]: '약 복용 필요',
  [AnimalSpecialNote.ONGOING_TREATMENT_OR_RECOVERY]: '치료/회복 중',
  [AnimalSpecialNote.POTTY_ACCIDENTS]: '배변 실수 있음',
  [AnimalSpecialNote.AGGRESSION_TOWARD_OTHER_ANIMALS]: '타 동물 공격성 있음',
  [AnimalSpecialNote.DISABLED_OR_ILL_PETS_ACCEPTED]: '장애/질환 있음',
};

export const NOTICE_TYPE_LABEL_KO: Record<NoticeType, string> = {
  [NoticeType.GENERAL]: '공지',
  [NoticeType.EVENT]: '이벤트',
  [NoticeType.MAINTENANCE]: '점검',
  [NoticeType.POLICY]: '정책',
  [NoticeType.RECRUITMENT]: '채용',
};
