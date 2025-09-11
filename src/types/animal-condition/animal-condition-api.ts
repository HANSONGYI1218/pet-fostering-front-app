import {
  AnimalType,
  AnimalSize,
  AnimalGender,
  ANIMAL_AGE,
  ANIMAL_HEALTH,
  ANIMAL_ENVIRONMENT,
  ANIMAL_PERIOD,
  ANIMAL_PERSONALITYS,
  ANIMAL_SPECIAL_NOTES,
} from './animal-condition';

export type AnimalConditionItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  gender: AnimalGender;
  animal_age: ANIMAL_AGE;
  animal_healths: ANIMAL_HEALTH[];
  animal_personalitys: ANIMAL_PERSONALITYS[];
  foster_environments: ANIMAL_ENVIRONMENT[];
  special_notes_animalss: ANIMAL_SPECIAL_NOTES[];
  foster_period: ANIMAL_PERIOD;
  created_at: Date;
  updated_at: Date;
  animal_id: string;
};
