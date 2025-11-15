import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPeriod,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import {
  AnimalSize,
  AnimalType,
  AnimalGender,
  AnimalStatus,
} from '@/entities/animal/animal';
import { UserInfoItem } from '@/entities/user/user-api';

function getRandomItems<T>(arr: T[]): T[] {
  if (arr.length === 0) return [];
  const count = Math.floor(Math.random() * arr.length) + 1;
  return arr.sort(() => 0.5 - Math.random()).slice(0, count);
}

const periods = Object.values(AnimalPeriod);

export const dummyUsers: UserInfoItem[] = Array.from({ length: 30 }).map(
  (_, idx) => ({
    id: `user-${idx + 1}`,
    displayName: `User ${idx + 1}`,
    name: `Name ${idx + 1}`,
    email: `useradsssages12${idx + 1}@example.com`,
    phoneNumber: `010-0000-00${String(idx + 1).padStart(2, '0')}`,
    zipcode: `12345`,
    address: `Seoul, District District District District${idx + 1}`,
    addressDetail: `Apt ${idx + 101}`,
    introduction: `Hello, I am user ${idx + 1}`,
    isEligibleForFoster: idx % 2 === 0,
    notification: {
      commentEmail: idx % 2 === 0,
      fosterAnimalInfoEmail: idx % 3 === 0,
      fosterAnimalInfoKakao: idx % 4 === 0,
      marketingEmail: true,
      marketingKakao: false,
    },

    // ✅ posts 더미
    posts: Array.from({ length: idx % 3 }).map((_, postIdx) => ({
      id: `post-${idx + 1}-${postIdx + 1}`,
      title: `Post Title ${postIdx + 1} by User ${idx + 1}`,
      content: `This is post content ${postIdx + 1} from User ${idx + 1}.`,
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 500),
    })),

    // ✅ comments 더미
    comments: Array.from({ length: idx % 4 }).map((_, commentIdx) => ({
      id: `comment-${idx + 1}-${commentIdx + 1}`,
      content: `Comment ${commentIdx + 1} by User ${idx + 1}`,
      likeCount: Math.floor(Math.random() * 100),
      post: {
        id: `post-${((idx + commentIdx) % 10) + 1}`,
        title: `Post ${((idx + commentIdx) % 10) + 1} Title`,
        content: `Post ${((idx + commentIdx) % 10) + 1} Content`,
      },
    })),

    // ✅ animals 배열로 수정
    animals:
      idx % 3 === 0
        ? Array.from({ length: idx % 4 }).map((_, aniIdx) => ({
            id: `Animal ${idx + 1}-${aniIdx + 1}`,
            name: `Animal ${idx + 1}-${aniIdx + 1}`,
            size: ['SMALL', 'MEDIUM', 'LARGE'][idx % 3] as AnimalSize,
            type: ['DOG', 'CAT'][idx % 2] as AnimalType,
            breed: `Breed ${idx + 1}-${aniIdx + 1}`,
            birth_date: new Date(2020, idx % 12, (idx % 28) + 1),
            euthanasia_date: idx % 5 === 0 ? new Date(2025, 11, 31) : null,
            gender: ['MALE', 'FEMALE'][idx % 2] as AnimalGender,
            images: [`https://picsum.photos/200?random=${idx + aniIdx + 1}`],
            introduction: `Animal ${idx + 1}-${aniIdx + 1} is a lovely pet.`,
            remark: `Remark for animal ${idx + 1}-${aniIdx + 1}`,
            created_at: new Date(2023, idx % 12, (idx % 28) + 1),
            updated_at: new Date(2024, idx % 12, (idx % 28) + 1),
            current_foster_start_date: new Date(2024, idx % 12, 1),
            current_foster_end_date: new Date(2024, idx % 12, 28),
            state: ['WAITING', 'IN_PROGRESS', 'COMPLETED'][
              idx % 3
            ] as AnimalStatus,
            isEmergency: idx % 7 === 0,
            emergency_reason: idx % 7 === 0 ? 'Medical issue' : null,
            organization: {
              id: `org-${(idx % 5) + 1}`,
              name: `Organization ${(idx % 5) + 1}`,
              phoneNumber: `02-000-00${idx + 1}`,
              address: `Org Address ${(idx % 5) + 1}`,
              addressDetail: `Suite ${idx + 10}`,
            },
            animal_condition: {
              animal_healths: getRandomItems(Object.values(AnimalHealth)),
              animal_personalitys: getRandomItems(
                Object.values(AnimalPersonality),
              ),
              foster_environments: getRandomItems(
                Object.values(AnimalEnvironment),
              ),
              special_notes_animals: getRandomItems(
                Object.values(AnimalSpecialNote),
              ),
              foster_period: periods[idx % periods.length],
            },
          }))
        : [],
  }),
);
