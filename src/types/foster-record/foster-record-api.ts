import { AnimalGender, AnimalType, FosterState } from '../animal/animal';
import { FosterRecord } from './foster-record';

export type FosterMatchInfo = {
  id: string;
  state: FosterState;
  organization: {
    id: string;
    name: string;
    phone_number: string;
    zipcode: string;
    address_detail: string;
    address: string;
    email: string;
  };
  animal: {
    name: string;
    type: AnimalType;
    breed: string;
    age: number;
    gender: AnimalGender;
    remark: string;
    images: string[];
  };
  created_at: Date;
};

export type FosterRecordItem = {
  id: string;
  state: FosterState;
  organization: {
    id: string;
    name: string;
    phone_number: string;
    zipcode: string;
    address_detail: string;
    address: string;
    email: string;
  };
  animal: {
    name: string;
    type: AnimalType;
    breed: string;
    age: number;
    gender: AnimalGender;
    remark: string;
    images: string[];
  };
  created_at: Date;
  foster_records: FosterRecord[];
};
