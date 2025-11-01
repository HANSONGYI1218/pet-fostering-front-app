import {
  AnimalGender,
  AnimalType,
  AnimalStatus,
  AnimalSize,
} from '../animal/animal';
import { FosterRecord } from './foster-record';

export type FosterMatchInfo = {
  id: string;
  state: AnimalStatus;
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
    size: AnimalSize;
    type: AnimalType;
    breed: string;
    birth_date: Date | null;
    introduction: string;
    current_foster_start_date: Date | null;
    current_foster_end_date: Date | null;
    gender: AnimalGender;
    remark: string;
    images: string[];
  };
  created_at: Date;
};

export type FosterRecordItem = {
  id: string;
  state: AnimalStatus;
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
    birth_date: Date;
    gender: AnimalGender;
    remark: string;
    images: string[];
  };
  created_at: Date;
  foster_records: FosterRecord[];
};

export type RecordUpsertPayload = {
  images?: string[] | null;
  content?: string | null;
  healthNote?: string | null;
};

export type { FosterRecord };
