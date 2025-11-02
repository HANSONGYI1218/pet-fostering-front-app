import { AnimalType, AnimalSize } from '@/entities/animal/animal';
import {
  AnimalAge,
  AnimalHealth,
  AnimalSpecialNote,
  AnimalPeriod,
} from '@/entities/animal-condition/animal-condition';

export enum FosterEnvironment {
  QUIET_ENVIRONMENT = 'QUIET_ENVIRONMENT',
  AVAILABILITY_FOR_WALKS_PLAY = 'AVAILABILITY_FOR_WALKS_PLAY',
  FREQUENT_INTERACTION_WITH_PETS = 'FREQUENT_INTERACTION_WITH_PETS',
  PRESENCE_OF_OTHER_ANIMAL = 'PRESENCE_OF_OTHER_ANIMAL',
  WILLINGNESS_FOR_POTTY_TRAINING = 'WILLINGNESS_FOR_POTTY_TRAINING',
  PATIENCE_WITH_BARKING_BITING = 'PATIENCE_WITH_BARKING_BITING',
  CARE_FOR_SENSITIVE_OR_FEARFUL_PETS = 'CARE_FOR_SENSITIVE_OR_FEARFUL_PETS',
  HOUSEHOLD_WITH_YOUNG_CHILDREN = 'HOUSEHOLD_WITH_YOUNG_CHILDREN',
}

export type FosterCondition = {
  id: string;
  type: AnimalType[];
  size: AnimalSize[];
  animal_age: AnimalAge[];
  animal_healths: AnimalHealth[];
  foster_environments: FosterEnvironment[];
  special_notes_animals: AnimalSpecialNote[];
  foster_period: AnimalPeriod[];
  created_at: Date;
  updated_at: Date;
  user_id: string; //임시보호자 id
};
