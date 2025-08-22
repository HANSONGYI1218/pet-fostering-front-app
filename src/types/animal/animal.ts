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
  ADOPTED = 'ADOPTED ',
}

export type Animal = {
  id: number;
  name: string;
  type: AnimalType;
  breed: string;
  age: number;
  gender: AnimalGender;
  images: string[];
  introduction: number;
  remark: string;
  created_at: Date;
  updated_at: Date;
  state: FosterState;
  organization_id: string;
  animal_condition_id: string;
  foster_match_id: string;
};
