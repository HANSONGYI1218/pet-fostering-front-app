import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import {
  AnimalGender,
  AnimalSize,
  AnimalStatus,
  AnimalType,
} from '@/entities/animal/animal';
import { UserInfoItem } from '@/entities/user/user-api';
import { expectOk } from '@/features/mypage/api/user';
import { apiFetch } from '@/shared/api/http';

type UserResponseDto = {
  id: string;
  displayName: string | null;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  zipcode: string | null;
  address: string | null;
  addressDetail: string | null;
  introduction: string | null;
  isEligibleForFoster: boolean;
  notification: {
    commentEmail: boolean;
    fosterAnimalInfoEmail: boolean;
    fosterAnimalInfoKakao: boolean;
    marketingEmail: boolean;
    marketingKakao: boolean;
  };
  posts: {
    id: string;
    title: string | null;
    content: string | null;
    viewCount: number | null;
    likeCount: number | null;
  }[];
  comments: {
    id: string;
    content: string | null;
    likeCount: number | null;
    post: {
      id: string;
      title: string | null;
      content: string | null;
    };
  }[];
  animals: {
    id: string;
    name: string;
    size: AnimalSize;
    type: AnimalType;
    breed: string;
    birth_date: Date;
    euthanasia_date: Date | null;
    gender: AnimalGender;
    images: string[];
    introduction: string;
    remark: string;
    created_at: Date;
    updated_at: Date;
    current_foster_start_date: Date;
    current_foster_end_date: Date;
    state: AnimalStatus;
    isEmergency: boolean;
    emergency_reason: string;
    organization: {
      id: string;
      name: string;
      phoneNumber?: string | null;
      address?: string | null;
      addressDetail?: string | null;
    };
    animal_condition: {
      animal_healths: AnimalHealth[];
      animal_personalitys: AnimalPersonality[];
      foster_environments: AnimalEnvironment[];
      special_notes_animals: AnimalSpecialNote[];
      foster_period: AnimalPeriod;
    };
  }[];
};

export const mapUsers = (dto: UserResponseDto): UserInfoItem => ({
  id: dto.id,
  displayName: dto.displayName,
  name: dto.name,
  email: dto.email,
  phoneNumber: dto.phoneNumber,
  zipcode: dto.zipcode,
  address: dto.address,
  addressDetail: dto.addressDetail,
  introduction: dto.introduction,
  isEligibleForFoster: dto.isEligibleForFoster,
  notification: {
    commentEmail: dto.notification.commentEmail,
    fosterAnimalInfoEmail: dto.notification.fosterAnimalInfoEmail,
    fosterAnimalInfoKakao: dto.notification.fosterAnimalInfoKakao,
    marketingEmail: dto.notification.marketingEmail,
    marketingKakao: dto.notification.marketingKakao,
  },
  posts: dto.posts
    ? dto.posts.map((post) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        viewCount: post.viewCount,
        likeCount: post.likeCount,
      }))
    : [],
  comments: dto.comments
    ? dto.comments.map((comment) => ({
        id: comment.id,
        content: comment.content,
        likeCount: comment.likeCount,
        post: {
          id: comment.post.id,
          title: comment.post.title,
          content: comment.post.content,
        },
      }))
    : [],
  animals: dto.animals
    ? dto.animals.map((animal) => ({
        id: animal.id,
        name: animal.name,
        size: animal.size,
        type: animal.type,
        breed: animal.breed,
        birth_date: animal.birth_date,
        euthanasia_date: animal.euthanasia_date,
        gender: animal.gender,
        images: animal.images,
        introduction: animal.introduction,
        remark: animal.remark,
        created_at: animal.created_at,
        updated_at: animal.updated_at,
        current_foster_start_date: animal.current_foster_start_date,
        current_foster_end_date: animal.current_foster_end_date,
        state: animal.state,
        isEmergency: animal.isEmergency,
        emergency_reason: animal.emergency_reason,
        organization: animal.organization,
        animal_condition: animal.animal_condition,
      }))
    : [],
});

export const fetchUsers = async (token?: string) => {
  const response = await expectOk(
    await apiFetch('/users/me/profile', {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      auth: 'required',
      token,
    }),
  );

  const payload = (await response.json()) as UserResponseDto;

  return mapUsers(payload);
};
