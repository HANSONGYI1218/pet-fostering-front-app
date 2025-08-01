'use client';

import { FosterRecord } from '@/types/foster-record/foster-record';
import RecordCalendar from './record-calendar/record-calendar';
import { RecordProvider } from '@/providers/record-provider';

export default function RecordContainer({
  records,
  isDog,
}: {
  records: FosterRecord[];
  isDog: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-10">
      <RecordProvider
        records={records}
        initalValue={records[records.length - 1]}
        isDog={isDog}
      >
        <RecordCalendar />
      </RecordProvider>
    </div>
  );
}
