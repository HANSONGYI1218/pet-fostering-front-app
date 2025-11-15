// import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// import { mapUsers, fetchUsers } from '../user-api';
// import { apiFetch } from '@/shared/api/http';

// vi.mock('@/shared/api/http', () => ({
//   apiFetch: vi.fn(),
// }));

// describe('mapUsers', () => {
//   it('UserResponseDto를 UserInfoItem으로 올바르게 매핑한다', () => {
//     const dto = {
//       id: 'user-1',
//       displayName: '테스터',
//       name: '홍길동',
//       email: 'test@example.com',
//       phoneNumber: '010-1234-5678',
//       zipcode: '12345',
//       address: '서울시',
//       addressDetail: '강남구',
//       introduction: '안녕하세요',
//       isEligibleForFoster: true,
//       notification: {
//         commentEmail: true,
//         fosterAnimalInfoEmail: false,
//         fosterAnimalInfoKakao: true,
//         marketingEmail: false,
//         marketingKakao: true,
//       },
//       posts: [
//         {
//           id: 'post-1',
//           title: '게시글1',
//           content: '내용1',
//           viewCount: 10,
//           likeCount: 5,
//         },
//       ],
//       comments: [
//         {
//           id: 'comment-1',
//           content: '댓글1',
//           likeCount: 2,
//           post: { id: 'post-1', title: '게시글1', content: '내용1' },
//         },
//       ],
//       animals: [
//         {
//           id: 'animal-1',
//           name: '강아지',
//           size: 'SMALL',
//           type: 'DOG',
//           breed: '믹스',
//           birth_date: new Date('2020-01-01'),
//           euthanasia_date: null,
//           gender: 'MALE',
//           images: [],
//           introduction: '얌전함',
//           remark: '',
//           created_at: new Date(),
//           updated_at: new Date(),
//           current_foster_start_date: new Date(),
//           current_foster_end_date: new Date(),
//           state: 'ADOPTABLE',
//           isEmergency: false,
//           emergency_reason: '',
//           organization: { id: 'org-1', name: '보호소' },
//           animal_condition: {
//             animal_healths: [],
//             animal_personalitys: [],
//             foster_environments: [],
//             special_notes_animals: [],
//             foster_period: { start: new Date(), end: new Date() },
//           },
//         },
//       ],
//     };

//     const result = mapUsers(dto as any);
//     expect(result.id).toBe('user-1');
//     expect(result.name).toBe('홍길동');
//     expect(result.posts[0].id).toBe('post-1');
//     expect(result.comments[0].id).toBe('comment-1');
//     expect(result.animals[0].id).toBe('animal-1');
//   });
// });

// describe('fetchUsers', () => {
//   const fetchMock = apiFetch as unknown as ReturnType<typeof vi.fn>;

//   beforeEach(() => {
//     fetchMock.mockReset();
//   });

//   it('apiFetch를 호출하고 mapUsers 결과를 반환한다', async () => {
//     const dummyDto = {
//       id: 'user-1',
//       displayName: null,
//       name: '홍길동',
//       notification: {
//         commentEmail: true,
//         fosterAnimalInfoEmail: false,
//         fosterAnimalInfoKakao: true,
//         marketingEmail: false,
//         marketingKakao: true,
//       },
//       posts: [],
//       comments: [],
//       animals: [],
//     } as any;

//     fetchMock.mockResolvedValue({
//       json: async () => dummyDto,
//       ok: true,
//     });

//     const token = 'token-123';
//     const result = await fetchUsers(token);

//     expect(fetchMock).toHaveBeenCalledTimes(1);
//     expect(fetchMock).toHaveBeenCalledWith(
//       '/users/me/profile',
//       expect.objectContaining({
//         headers: expect.any(Object),
//         cache: 'no-store',
//         auth: 'required',
//         token,
//       }),
//     );

//     expect(result.id).toBe('user-1');
//     expect(result.name).toBe('홍길동');
//   });
// });
