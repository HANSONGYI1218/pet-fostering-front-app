import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '../animal-condition/animal-condition';
import { FosterApplicent } from '../foster-apply/foster-apply-api';
import { FosterRecord } from '../foster-record/foster-record';
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
  birth_date: Date | null;
  gender: AnimalGender;
  image: string;
  isBookmarked: boolean;
  animal_healths: AnimalHealth[];
  animal_personalitys: AnimalPersonality[];
  foster_environments: AnimalEnvironment[];
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
  birth_date: Date | null;
  gender: AnimalGender;
  images: string[];
  introduction: string;
  remark: string;
  isBookmarked: boolean;
  current_foster_start_date: Date | null;
  current_foster_end_date: Date | null;
  animal_healths: AnimalHealth[];
  animal_personalitys: AnimalPersonality[];
  foster_environments: AnimalEnvironment[];
  special_notes_animals: AnimalSpecialNote[];
  isEmergency: boolean;
  emergency_reason: string;
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
  animal_healths: AnimalHealth[];
  animal_personalitys: AnimalPersonality[];
  foster_environments: AnimalEnvironment[];
  isEmergency: boolean;
  foster_apply_number: number;
};

export type OgrainzationAnimalDetailItem = {
  id: string;
  name: string;
  type: AnimalType;
  size: AnimalSize;
  breed: string;
  birth_date: Date;
  gender: AnimalGender;
  images: string[];
  introduction: string;
  remark: string;
  isBookmarked: boolean;
  current_foster_start_date: Date;
  current_foster_end_date: Date;
  foster_records: FosterRecord[];
  animal_healths: AnimalHealth[];
  animal_personalitys: AnimalPersonality[];
  foster_environments: AnimalEnvironment[];
  special_notes_animals: AnimalSpecialNote[];
  isEmergency: boolean;
  emergency_reason: string;
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
