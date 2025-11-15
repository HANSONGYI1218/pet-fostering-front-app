import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from '../animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalStatus,
  AnimalType,
} from '../animal/animal';

export type UserProfileItem = {
  id: string;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  zipcode: string | null;
  address: string | null;
  addressDetail: string | null;
  introduction: string | null;
  isEligibleForFoster: boolean;
};

export type UserNotificationSettingItem = {
  commentEmail: boolean;
  fosterAnimalInfoEmail: boolean;
  fosterAnimalInfoKakao: boolean;
  marketingEmail: boolean;
  marketingKakao: boolean;
};

export type UpdateUserProfilePayload = {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  password?: string | null;
  zipcode?: string | null;
  address?: string | null;
  addressDetail?: string | null;
  introduction?: string | null;
};

export type UpdateUserNotificationSettingPayload = {
  commentEmail?: boolean;
  fosterAnimalInfoEmail?: boolean;
  fosterAnimalInfoKakao?: boolean;
  marketingEmail?: boolean;
  marketingKakao?: boolean;
};

export type UserInfoItem = {
  id: string;
  displayName?: string | null;
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  zipcode?: string | null;
  address?: string | null;
  addressDetail?: string | null;
  introduction?: string | null;
  isEligibleForFoster: boolean;
  notification?: {
    commentEmail: boolean;
    fosterAnimalInfoEmail: boolean;
    fosterAnimalInfoKakao: boolean;
    marketingEmail: boolean;
    marketingKakao: boolean;
  };
  posts:
    | {
        id: string;
        title?: string | null;
        content?: string | null;
        viewCount?: number | null;
        likeCount?: number | null;
      }[]
    | [];
  comments:
    | {
        id: string;
        content?: string | null;
        likeCount?: number | null;
        post: {
          id: string;
          title?: string | null;
          content?: string | null;
        };
      }[]
    | [];
  animals:
    | {
        id: string;
        name?: string;
        size: AnimalSize;
        type: AnimalType;
        breed: string;
        birth_date?: Date | null;
        euthanasia_date?: Date | null;
        gender: AnimalGender;
        images?: string[] | null;
        introduction?: string | null;
        remark?: string | null;
        created_at?: Date | null;
        updated_at?: Date | null;
        current_foster_start_date?: Date | null;
        current_foster_end_date?: Date | null;
        state: AnimalStatus;
        isEmergency: boolean;
        emergency_reason?: string | null;
        organization?: {
          id?: string | null;
          name?: string | null;
          phoneNumber?: string | null;
          address?: string | null;
          addressDetail?: string | null;
        };
        animal_condition: {
          animal_healths?: AnimalHealth[] | null;
          animal_personalitys?: AnimalPersonality[] | null;
          foster_environments?: AnimalEnvironment[] | null;
          special_notes_animals?: AnimalSpecialNote[] | null;
          foster_period?: AnimalPeriod | null;
        };
      }[]
    | [];
};
