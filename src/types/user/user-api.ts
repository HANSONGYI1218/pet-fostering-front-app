export type UserInfoItem = {
  id: string;
  name: string;
  nickname: string;
  introduction: string;
  phone_number: string;
  email: string;
  zipcode: string;
  address: string;
  address_datail: string;
  isEligibleForFoster: boolean;
};

export type UserSettingInfoItem = {
  id: string;
  comment_email: boolean;
  foster_animal_info_email: boolean;
  foster_animal_info_kakao: boolean;
  marketing_email: boolean;
  marketing_kakao: boolean;
};
