import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { PropsWithChildren } from 'react';

import { RecordProvider, useRecord } from '../record-provider';
import type { FosterRecord } from '@/entities/foster-record/foster-record';

const createRecord = (
  id: string,
  createdAt: string,
  content = 'content',
): FosterRecord => ({
  id,
  images: [],
  content,
  health_note: 'note',
  created_at: new Date(createdAt),
  updated_at: new Date(createdAt),
});

const createWrapper = (
  records: FosterRecord[],
  initial: FosterRecord,
): ((props: PropsWithChildren) => JSX.Element) =>
  function Wrapper({ children }: PropsWithChildren) {
    return (
      <RecordProvider
        records={records}
        initialValue={initial}
        isDog
        animalId="animal-ctx"
      >
        {children}
      </RecordProvider>
    );
  };

describe('RecordProvider', () => {
  it('upsertRecord는 새 기록을 추가하고 생성일 순으로 정렬한다', () => {
    const initialRecords = [
      createRecord('2', '2024-02-01'),
      createRecord('1', '2024-01-01'),
    ];
    const newRecord = createRecord('3', '2024-03-01');

    const { result } = renderHook(() => useRecord(), {
      wrapper: createWrapper(initialRecords, initialRecords[0]),
    });

    act(() => {
      result.current.upsertRecord(newRecord);
    });

    expect(result.current.records.map((record) => record.id)).toEqual([
      '1',
      '2',
      '3',
    ]);
  });

  it('upsertRecord는 기존 기록을 갱신하고 선택된 기록도 업데이트한다', () => {
    const initialRecords = [
      createRecord('1', '2024-01-01', 'original'),
      createRecord('2', '2024-02-01', 'second'),
    ];
    const updatedRecord = createRecord('1', '2024-01-01', 'updated');

    const { result } = renderHook(() => useRecord(), {
      wrapper: createWrapper(initialRecords, initialRecords[0]),
    });

    act(() => {
      result.current.upsertRecord(updatedRecord);
    });

    expect(result.current.selectedRecord).toEqual(
      expect.objectContaining({ content: 'updated' }),
    );
  });

  it('removeRecord는 기록과 선택 상태를 제거한다', () => {
    const initialRecords = [
      createRecord('1', '2024-01-01'),
      createRecord('2', '2024-02-01'),
    ];

    const { result } = renderHook(() => useRecord(), {
      wrapper: createWrapper(initialRecords, initialRecords[0]),
    });

    act(() => {
      result.current.removeRecord('1');
    });

    expect(result.current.records.map((record) => record.id)).toEqual(['2']);
    expect(result.current.selectedRecord).toBeNull();
  });
});
