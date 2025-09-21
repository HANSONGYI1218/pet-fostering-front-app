import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useEffect, useState } from 'react';

import CalendarDialogForm from '../calendar-dialog-form';
import { RecordProvider, useRecord } from '@/providers/record-provider';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { WholeDateArray } from '../tr';

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
    const initialRecords = [createRecord('seed', new Date('2024-01-01'), 'seed')];
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
      <RecordProvider records={initialRecords} initalValue={initialRecords[0]} isDog>
        <Wrapper />
      </RecordProvider>,
    );

    const user = userEvent.setup();

    const triggerButton = screen.getByRole('button', {
      name: new RegExp(props.formattedDate),
    });

    await user.click(triggerButton);

    const contentField = await screen.findByPlaceholderText(
      /임시보호중인 동물의 기록을 자유롭게 작성해주세요/,
    );
    const healthField = screen.getByPlaceholderText(
      /임시보호중인 동물의 건강상태를 작성해주세요/,
    );

    await user.type(contentField, '새로운 기록');
    await user.type(healthField, '오늘은 아주 건강했어요');

    const submitButton = screen.getByRole('button', { name: '완료' });
    await user.click(submitButton);

    await waitFor(() => {
      const latest = handleRecords.mock.lastCall?.[0] as FosterRecord[];
      expect(latest?.some((record) => record.content === '새로운 기록')).toBe(
        true,
      );
    });
  });

  it('기존 기록을 수정하면 동일한 id로 갱신된다', async () => {
    const targetDate = new Date('2024-02-03');
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
      <RecordProvider records={initialRecords} initalValue={existingRecord} isDog>
        <Wrapper />
      </RecordProvider>,
    );

    const user = userEvent.setup();

    const triggerButton = screen.getByRole('button', {
      name: new RegExp(props.formattedDate),
    });

    await user.click(triggerButton);

    const contentField = await screen.findByPlaceholderText(
      /임시보호중인 동물의 기록을 자유롭게 작성해주세요/,
    );

    await user.clear(contentField);
    await user.type(contentField, '수정된 기록');

    const submitButton = screen.getByRole('button', { name: '수정' });
    await user.click(submitButton);

    await waitFor(() => {
      const latest = handleRecords.mock.lastCall?.[0] as FosterRecord[];
      expect(latest?.find((record) => record.id === 'existing')?.content).toBe(
        '수정된 기록',
      );
    });
  });
});
