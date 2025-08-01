import { AnimalType, AnimalGender, FosterState } from './animal';

export type FosterRecordAnimalItem = {
  id: number;
  name: string;
  type: AnimalType;
  breed: string;
  age: number;
  gender: AnimalGender;
  images: string[];
  foster_duration: number;
  state: FosterState;
  foster_match_id: string;
};
