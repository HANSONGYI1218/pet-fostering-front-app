import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import { DetailInfoDialog } from '../detail-info-dialog';
import type { UserInfoItem } from '@/entities/user/user-api';

// 더미 데이터 생성
const dummyUser: UserInfoItem = {
  id: 'user-1',
  name: 'Test User',
  email: 'test@example.com',
  phoneNumber: '010-1234-5678',
  address: 'Seoul, District',
  addressDetail: 'Apt 101',
  introduction: 'Hello, I am a test user.',
  isEligibleForFoster: true,
  notification: {
    commentEmail: true,
    fosterAnimalInfoEmail: false,
    marketingEmail: true,
    fosterAnimalInfoKakao: false,
    marketingKakao: true,
  },
  animals: [
    {
      id: 'animal-1',
      name: 'Doggo',
      size: 'MEDIUM',
      type: 'DOG',
      breed: 'Bulldog',
      birth_date: new Date(2021, 1, 1),
      gender: 'MALE',
      state: 'WAITING',
      isEmergency: false,
      animal_condition: {},
    },
  ],
  posts: [
    {
      id: 'post-1',
      title: 'Post 1',
      content: 'Content 1',
      viewCount: 10,
      likeCount: 5,
    },
  ],
  comments: [
    {
      id: 'comment-1',
      content: 'Comment 1',
      likeCount: 2,
      post: { id: 'post-1', title: 'Post 1' },
    },
  ],
  displayName: 'TestUser',
};

describe('DetailInfoDialog', () => {
  it('Dialog 열기 버튼이 보이고 클릭하면 Dialog가 열린다', async () => {
    const user = userEvent.setup();
    render(<DetailInfoDialog user={dummyUser} />);

    // DialogTrigger 버튼 확인
    const trigger = screen.getByRole('cell');
    expect(trigger).toBeInTheDocument();

    // 클릭하여 Dialog 열기
    await user.click(trigger);

    // Dialog Title 확인
    const title = await screen.findByText('사용자 정보');
    expect(title).toBeInTheDocument();
  });

  it('사용자 기본 정보가 렌더링 된다', async () => {
    const user = userEvent.setup();
    render(<DetailInfoDialog user={dummyUser} />);

    await user.click(screen.getByRole('cell'));

    expect(await screen.findByText(dummyUser.name)).toBeInTheDocument();
    expect(screen.getByText(dummyUser.email)).toBeInTheDocument();
    expect(screen.getByText(dummyUser.phoneNumber)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(dummyUser.address))).toBeInTheDocument();
    expect(screen.getByText(dummyUser.introduction)).toBeInTheDocument();
  });

  it('AnimalTile, PostTile, CommentTile이 렌더링 된다', async () => {
    const user = userEvent.setup();
    render(<DetailInfoDialog user={dummyUser} />);

    await user.click(screen.getByRole('cell'));

    // AnimalTile
    expect(screen.getByText('Doggo')).toBeInTheDocument();

    // PostTile
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Content 1')).toBeInTheDocument();

    // CommentTile
    expect(screen.getByText('Comment 1')).toBeInTheDocument();
    expect(screen.getByText('Post 1에 대한 댓글')).toBeInTheDocument();
  });
});
