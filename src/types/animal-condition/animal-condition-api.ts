import { AnimalType, AnimalSize, AnimalGender } from '@/types/animal/animal';
import {
  AnimalAge,
  AnimalHealth,
  AnimalEnvironment,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from './animal-condition';

export type AnimalConditionItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  gender: AnimalGender;
  animal_age: AnimalAge;
  animal_healths: AnimalHealth[];
  animal_personalitys: AnimalPersonality[];
  foster_environments: AnimalEnvironment[];
  special_notes_animals: AnimalSpecialNote[];
  foster_period: AnimalPeriod;
  created_at: Date;
  updated_at: Date;
  animal_id: string;
};
