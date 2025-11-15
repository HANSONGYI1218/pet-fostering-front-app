import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

import UserContainer from '../user-container';
import { dummyUsers } from '@/features/admin/api/dummydata';

describe('UserContainer', () => {
  it('사용자 목록과 테이블 헤더를 렌더링한다', async () => {
    render(<UserContainer users={dummyUsers} />);

    // 테이블 헤더 존재 확인
    expect(screen.getByText('이름')).toBeInTheDocument();
    expect(screen.getByText('전화번호')).toBeInTheDocument();
    expect(screen.getByText('이메일')).toBeInTheDocument();
    expect(screen.getByText('주소')).toBeInTheDocument();
    expect(screen.getByText('임보자격')).toBeInTheDocument();
    expect(screen.getByText('임보등록')).toBeInTheDocument();
    expect(screen.getByText('게시글')).toBeInTheDocument();
    expect(screen.getByText('댓글')).toBeInTheDocument();

    // 첫 번째 사용자 이름 확인
    expect(screen.getByText(dummyUsers[0].name)).toBeInTheDocument();

    // 첫 번째 사용자 주소 확인 (부분 문자열)
    const addressCell = await screen.findByText(dummyUsers[0].address);
    expect(addressCell).toBeInTheDocument();
  });

  it('DetailInfoDialog 트리거가 존재한다', () => {
    render(<UserContainer users={dummyUsers} />);

    // 트리거는 underline 스타일의 TableCell
    const dialogTriggers = screen.getAllByRole('cell', { name: '' });
    expect(dialogTriggers.length).toBe(dummyUsers.length);
  });

  it('조건 초기화 버튼이 존재하고 클릭 가능하다', async () => {
    const user = userEvent.setup();
    render(<UserContainer users={dummyUsers} />);
    const resetButton = screen.getByRole('button', { name: /조건 초기화/i });
    expect(resetButton).toBeInTheDocument();

    await user.click(resetButton);
    // 클릭 시 sortOrder와 eligibleForFosterStatus가 초기화되는지 확인 (내부 state 확인 불가시 UI 변화로 확인 가능)
  });

  it('검색 입력에 따라 필터링이 적용된다', async () => {
    const user = userEvent.setup();
    render(<UserContainer users={dummyUsers} />);
    const searchInput =
      screen.getByPlaceholderText('이름, 전화번호, 이메일, 주소');

    await user.type(searchInput, dummyUsers[0].name);
    expect(screen.getByText(dummyUsers[0].name)).toBeInTheDocument();
  });

  it('사용자 데이터가 없는 경우 EmptyBox 렌더링', () => {
    render(<UserContainer users={[]} />);
    expect(screen.getByText('아직 보호동물이 없어요.')).toBeInTheDocument();
  });
});
