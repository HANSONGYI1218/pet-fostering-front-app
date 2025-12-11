export enum AnimalType {
  DOG = 'DOG',
  CAT = 'CAT',
}

export enum AnimalGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum AnimalSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum FosterState {
  IN_PROGRESS = 'IN_PROGRESS',
  FOSTERED = 'FOSTERED',
}

export enum AnimalStatus {
  WAITING = 'WAITING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type Animal = {
  id: string;
  name: string;
  size: AnimalSize;
  type: AnimalType;
  breed: string;
  weight: string;
  birth_date: Date;
  euthanasia_date: Date | null;
  gender: AnimalGender;
  images: string[];
  introduction: string;
  remark: string;
  found_location: string;
  current_location: string;
  created_at: Date;
  updated_at: Date;
  current_foster_start_date: Date;
  current_foster_end_date: Date;
  state: AnimalStatus;
  isEmergency: boolean;
  emergency_reason: string;
  organization_id: string;
  animal_condition_id: string;
  foster_match_id: string;
};
