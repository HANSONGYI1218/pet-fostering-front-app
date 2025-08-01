export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export type User = {
  id: string;
  name: string;
  gender: Gender;
  nickname: string;
  introduction: string;
  phone_number: string;
  email: string;
  manner_temperature: number;
  zipcode: string;
  address: string;
  address_datail: string;
  created_at: Date;
  updated_at: Date;
  foster_condition_id: string;
};
