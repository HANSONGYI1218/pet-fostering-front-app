import { AnimalType, AnimalSize } from '@/types/animal/animal';
import {
  AnimalAge,
  AnimalPeriod,
  AnimalSpecialNote,
} from '../animal-condition/animal-condition';
import { FosterEnvironment } from './foster-condition';

export type FosterExperienceItem = {
  id: string;
  animal_type: AnimalType;
  animal_size: AnimalSize;
  animal_age: AnimalAge;
  foster_start_date: Date;
  foster_end_date: Date;
  organization_name: string;
  note: string;
};

export type FosterConditionItem = {
  id: string;
  type: AnimalType[];
  size: AnimalSize[];
  animal_age: AnimalAge[];
  foster_environments: FosterEnvironment[];
  special_notes_animals: AnimalSpecialNote[];
  foster_period: AnimalPeriod;
  foster_experiences: FosterExperienceItem[];
};
