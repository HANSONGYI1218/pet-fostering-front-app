'use client';

import { useMemo, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

import SearchBox from '@/shared/widgets/form/search-box';
import { Card, CardAction } from '@/shared/ui/card';
import EmptyBox from '@/shared/widgets/feedback/empty-box';
import { UserInfoItem } from '@/entities/user/user-api';
import { filterUserList } from '../../domain/user-list/filters';
import { Button } from '@/shared/ui/button';
import { DetailInfoDialog } from './detail-info-dialog';

type SortOrder = '오름차순' | '내림차순' | '전체';

export default function UserContainer({ users }: { users: UserInfoItem[] }) {
  const [search, setSearch] = useState('');
  const [eligibleForFosterStatus, setEligibleForFosterStatus] = useState<
    '전체' | '등록' | '미등록'
  >('전체');
  const [sortColumn, setSortColumn] = useState<
    '임보등록' | '게시글' | '댓글' | null
  >(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('전체');

  const filteredUsers = useMemo(() => {
    let result = filterUserList(users ?? [], {
      eligibleForFosterStatus: eligibleForFosterStatus,
      keyword: search,
    });

    if (sortColumn) {
      result = [...result].sort((a, b) => {
        let aValue: number = 0;
        let bValue: number = 0;

        switch (sortColumn) {
          case '임보등록':
            aValue = a.animals?.length;
            bValue = b.animals?.length;
            break;
          case '게시글':
            aValue = a.posts?.length;
            bValue = b.posts?.length;
            break;
          case '댓글':
            aValue = a.comments?.length;
            bValue = b.comments?.length;
            break;
        }

        return sortOrder === '오름차순'
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });
    }

    return result;
  }, [users, eligibleForFosterStatus, search, sortColumn, sortOrder]);

  const resetCondition = () => {
    setSortOrder('전체');
    setEligibleForFosterStatus('전체');
  };

  return (
    <div className="flex flex-col gap-8">
      <Card className="flex cursor-default flex-col border-none p-0 shadow-none md:flex-row">
        <div className="flex flex-1 items-center gap-2">
          <Select
            value={eligibleForFosterStatus}
            onValueChange={(value) =>
              setEligibleForFosterStatus(value as '전체' | '등록' | '미등록')
            }
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="임보자격 여부" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="등록">등록</SelectItem>
                <SelectItem value="미등록">미등록</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardAction>
          <SearchBox
            placeholder="이름, 전화번호, 이메일, 주소"
            onChangeValue={setSearch}
            className="md:w-72"
          />
        </CardAction>
      </Card>
      {users?.length > 0 ? (
        filteredUsers?.length > 0 ? (
          <div className="flex flex-col gap-10">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={'outline'}
                  onClick={() => {
                    resetCondition();
                  }}
                  className="rounded-full text-sm text-neutral-600"
                >
                  조건 초기화 <RotateCcw />
                </Button>
              </div>
              <span className="text-right text-sm text-neutral-600">
                총 {users?.length}개
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]"></TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>주소</TableHead>
                  <TableHead>임보자격</TableHead>
                  <TableHead className="max-w-12">
                    <div className="flex items-center justify-center">
                      임보등록
                      <Select
                        value={sortOrder}
                        onValueChange={(value) => {
                          setSortColumn('임보등록');
                          setSortOrder(value as '오름차순' | '내림차순');
                        }}
                      >
                        <SelectTrigger className="w-fit border-none p-0 focus-visible:border-none focus-visible:ring-0"></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="오름차순">오름차순</SelectItem>
                            <SelectItem value="내림차순">내림차순</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead className="max-w-12">
                    <div className="flex items-center justify-center">
                      게시글
                      <Select
                        value={sortOrder}
                        onValueChange={(value) => {
                          setSortColumn('게시글');
                          setSortOrder(value as '오름차순' | '내림차순');
                        }}
                      >
                        <SelectTrigger className="w-fit border-none p-0 focus-visible:border-none focus-visible:ring-0"></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="오름차순">오름차순</SelectItem>
                            <SelectItem value="내림차순">내림차순</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead className="max-w-12">
                    <div className="flex items-center justify-center">
                      댓글
                      <Select
                        value={sortOrder}
                        onValueChange={(value) => {
                          setSortColumn('댓글');
                          setSortOrder(value as '오름차순' | '내림차순');
                        }}
                      >
                        <SelectTrigger className="w-fit border-none p-0 focus-visible:border-none focus-visible:ring-0"></SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="오름차순">오름차순</SelectItem>
                            <SelectItem value="내림차순">내림차순</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableHead>
                  <TableHead>자세히</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="w-[44px] text-left">
                      {index + 1}
                    </TableCell>
                    <TableCell className="max-w-12 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.name ?? ''}
                    </TableCell>
                    <TableCell className="max-w-20 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.phoneNumber ?? ''}
                    </TableCell>
                    <TableCell className="max-w-44 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.email ?? ''}
                    </TableCell>
                    <TableCell className="max-w-44 overflow-hidden text-ellipsis whitespace-nowrap">
                      {user?.address ?? ''}
                    </TableCell>
                    <TableCell>
                      {user.isEligibleForFoster ? '등록' : '미등록'}
                    </TableCell>
                    <TableCell
                      className={`max-w-16 ${user?.animals?.length > 0 && 'underline'}`}
                    >
                      {user?.animals?.length ?? 0}
                    </TableCell>
                    <TableCell
                      className={`max-w-16 ${user?.posts?.length > 0 && 'underline'}`}
                    >
                      {user?.posts?.length ?? 0}
                    </TableCell>
                    <TableCell
                      className={`max-w-16 ${user?.comments?.length > 0 && 'underline'}`}
                    >
                      {user?.comments?.length ?? 0}
                    </TableCell>
                    <DetailInfoDialog user={user} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EmptyBox
            className="min-h-96"
            text="조건에 맞는 보호동물이 없어요."
          />
        )
      ) : (
        <EmptyBox className="min-h-96" text="아직 보호동물이 없어요." />
      )}
    </div>
  );
}
