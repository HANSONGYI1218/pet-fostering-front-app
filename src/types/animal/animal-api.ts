import { AnimalType, AnimalGender, FosterState, AnimalSize } from './animal';

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

export type FosterListAnimalItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  breed: string;
  age: number;
  gender: AnimalGender;
  image: string;
  foster_duration: number;
  isBookmarked: boolean;
  animal_healths: string[];
  animal_personalitys: string[];
  foster_environments: string[];
  isEmergency: boolean;
  organization: {
    id: string;
    name: string;
    address: string;
    address_detail: string;
    phone_number: string;
  };
};
