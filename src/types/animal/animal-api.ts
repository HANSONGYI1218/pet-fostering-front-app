import {
  ANIMAL_ENVIRONMENT,
  ANIMAL_HEALTH,
  ANIMAL_PERSONALITYS,
  ANIMAL_SPECIAL_NOTES,
} from '../animal-condition/animal-condition';
import { FosterApplicent } from '../foster-apply/foster-apply-api';
import { AnimalType, AnimalGender, FosterState, AnimalSize } from './animal';

export type FosterRecordAnimalItem = {
  id: string;
  name: string;
  type: AnimalType;
  breed: string;
  birth_date: Date;
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
  birth_date: Date;
  gender: AnimalGender;
  image: string;
  isBookmarked: boolean;
  animal_healths: ANIMAL_HEALTH[];
  animal_personalitys: ANIMAL_PERSONALITYS[];
  foster_environments: ANIMAL_ENVIRONMENT[];
  isEmergency: boolean;
  organization: {
    id: string;
    name: string;
    address: string;
    address_detail: string;
    phone_number: string;
  };
};

export type FosterAnimalDetailItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  breed: string;
  birth_date: Date;
  gender: AnimalGender;
  images: string[];
  foster_duration: number;
  introduction: string;
  remark: string;
  isBookmarked: boolean;
  animal_healths: ANIMAL_HEALTH[];
  animal_personalitys: ANIMAL_PERSONALITYS[];
  foster_environments: ANIMAL_ENVIRONMENT[];
  special_notes_animals: ANIMAL_SPECIAL_NOTES[];
  isEmergency: boolean;
  organization: {
    id: string;
    name: string;
    address: string;
    address_detail: string;
    phone_number: string;
    donation_bank_name: string;
    donation_account_number: string;
    donation_account_holder: string;
  };
};

export type OgrainzationAnimalListItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  breed: string;
  birth_date: Date;
  gender: AnimalGender;
  animalStatus: FosterState;
  image: string;
  applicants: FosterApplicent[];
  animal_healths: ANIMAL_HEALTH[];
  animal_personalitys: ANIMAL_PERSONALITYS[];
  foster_environments: ANIMAL_ENVIRONMENT[];
  isEmergency: boolean;
  foster_apply_number: number;
};
