import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEffect, useState } from 'react';

import CalendarDialogForm from '../calendar-dialog-form';
import {
  RecordProvider,
  useRecord,
} from '@/features/record/context/record-provider';
import { FosterRecord } from '@/entities/foster-record/foster-record';
import { WholeDateArray } from '../tr';

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'test-animal-id' }),
}));

vi.mock('@/lib/auth/session', () => ({
  resolveStoredAccessToken: () => 'test-token',
}));

const createRecord = (
  id: string,
  date: Date,
  content: string,
): FosterRecord => ({
  id,
  images: [],
  content,
  health_note: 'healthy',
  created_at: date,
  updated_at: date,
});

describe('CalendarDialogForm', () => {
  it('새 기록을 작성하면 컨텍스트에 저장된다', async () => {
    const today = new Date();
    const props: WholeDateArray = {
      date: today,
      formattedDate: String(today.getDate()),
    };
    const initialRecords = [
      createRecord('seed', new Date('2024-01-01'), 'seed'),
    ];
    const handleRecords = vi.fn();

    function Observer() {
      const { records } = useRecord();

      useEffect(() => {
        handleRecords(records);
      }, [records]);

      return null;
    }

    function Wrapper() {
      const [currentMonth, setCurrentMonth] = useState(props.date);

      return (
        <>
          <CalendarDialogForm
            p={props}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
          <Observer />
        </>
      );
    }

    render(
      <RecordProvider
        records={initialRecords}
        initalValue={initialRecords[0]}
        isDog
      >
        <Wrapper />
      </RecordProvider>,
    );

    const user = userEvent.setup();

    const triggerButton = screen.getByRole('button', {
      name: new RegExp(props.formattedDate),
    });

    await user.click(triggerButton);

    const contentField = await waitFor(() =>
      screen.getByPlaceholderText(
        /임시보호중인 동물의 기록을 자유롭게 작성해주세요/s,
      ),
    );
    const healthField = await waitFor(() =>
      screen.getByPlaceholderText(
        /임시보호중인 동물의 건강상태를 작성해주세요/,
      ),
    );

    await user.type(contentField, '새로운 기록');
    await user.type(healthField, '오늘은 아주 건강했어요');

    const submitButton = await screen.getByRole('button', { name: '완료하기' });

    await user.click(submitButton);

    await waitFor(() => {
      const latest = handleRecords.mock.lastCall?.[0] as FosterRecord[];
      expect(latest?.some((record) => record.content === '새로운 기록')).toBe(
        true,
      );
    });
  });

  it('기존 기록을 수정하면 동일한 id로 갱신된다', async () => {
    const targetDate = new Date();
    const props: WholeDateArray = {
      date: targetDate,
      formattedDate: String(targetDate.getDate()),
    };
    const existingRecord = createRecord('existing', targetDate, 'original');
    const initialRecords = [existingRecord];
    const handleRecords = vi.fn();

    function Observer() {
      const { records } = useRecord();
      useEffect(() => {
        handleRecords(records);
      }, [records]);
      return null;
    }

    function Wrapper() {
      const [currentMonth, setCurrentMonth] = useState(props.date);
      return (
        <>
          <CalendarDialogForm
            p={props}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
          />
          <Observer />
        </>
      );
    }

    render(
      <RecordProvider
        records={initialRecords}
        initalValue={existingRecord}
        isDog
      >
        <Wrapper />
      </RecordProvider>,
    );

    const user = userEvent.setup();

    // 1️⃣ 날짜 버튼 클릭해서 Dialog 열기
    const triggerButton = await screen.findByRole('button', {
      name: new RegExp(props.formattedDate),
    });
    await user.click(triggerButton);

    // 2️⃣ Dialog 열렸는지 기다리기
    await waitFor(() => {
      expect(screen.getByText(/돌봄기록 생성/)).toBeInTheDocument();
    });

    // 2️⃣ Dialog 열리면 "수정하기" 버튼 찾기
    const editButton = await screen.findByRole('button', { name: '수정하기' });
    await user.click(editButton);

    // 3️⃣ Textarea 접근 후 수정
    const contentField = await screen.findByPlaceholderText(
      /임시보호중인 동물의 기록을 자유롭게 작성해주세요/,
    );
    await user.click(contentField);
    await user.keyboard('{Control>}a{/Control}');
    await user.keyboard('{Backspace}');
    await user.type(contentField, '수정된 기록');

    // 4️⃣ 완료 버튼 클릭
    const submitButton = await screen.findByRole('button', {
      name: '완료하기',
    });
    await user.click(submitButton);

    // 5️⃣ 컨텍스트 업데이트 확인
    await waitFor(() => {
      const latest = handleRecords.mock.lastCall?.[0] as FosterRecord[];
      expect(latest?.find((record) => record.id === 'existing')?.content).toBe(
        '수정된 기록',
      );
    });
  });
});
