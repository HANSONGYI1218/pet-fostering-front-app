'use client';

import { FosterRecord } from '@/types/foster-record/foster-record';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toDate } from '@/lib/utils';

const normalizeRecord = (record: FosterRecord): FosterRecord => {
  const createdAt = toDate(record.created_at);
  const updatedAt = toDate(record.updated_at);

  if (createdAt === record.created_at && updatedAt === record.updated_at) {
    return record;
  }

  return {
    ...record,
    created_at: createdAt,
    updated_at: updatedAt,
  };
};

// Context의 타입 정의
interface RecordContextType {
  records: FosterRecord[];
  selectedRecord: FosterRecord | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<FosterRecord | null>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isDog: boolean;
  upsertRecord: (record: FosterRecord) => void;
}

const RecordContext = createContext<RecordContextType | null>(null);

// Provider 컴포넌트
export const RecordProvider: React.FC<{
  records: FosterRecord[];
  initalValue: FosterRecord;
  isDog: boolean;
  children: React.ReactNode;
}> = ({ records, initalValue, isDog, children }) => {
  const normalizedRecords = useMemo(
    () => records.map((record) => normalizeRecord(record)),
    [records],
  );

  const [recordsState, setRecordsState] =
    useState<FosterRecord[]>(normalizedRecords);

  const normalizedInitialRecord = useMemo(
    () => (initalValue ? normalizeRecord(initalValue) : null),
    [initalValue],
  );

  const [selectedRecord, setSelectedRecord] = useState<FosterRecord | null>(
    normalizedInitialRecord,
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(
    normalizedInitialRecord
      ? toDate(normalizedInitialRecord.created_at)
      : new Date(),
  );

  useEffect(() => {
    setRecordsState(normalizedRecords);
  }, [normalizedRecords]);

  useEffect(() => {
    setSelectedRecord(normalizedInitialRecord);

    if (normalizedInitialRecord) {
      setCurrentMonth(toDate(normalizedInitialRecord.created_at));
    }
  }, [normalizedInitialRecord]);

  const upsertRecord = useCallback((rawRecord: FosterRecord) => {
    const normalized = normalizeRecord(rawRecord);

    setRecordsState((prev) => {
      const next = prev.some((item) => item.id === normalized.id)
        ? prev.map((item) => (item.id === normalized.id ? normalized : item))
        : [...prev, normalized];

      return next
        .slice()
        .sort(
          (a, b) =>
            toDate(a.created_at).getTime() - toDate(b.created_at).getTime(),
        );
    });

    setSelectedRecord((current) =>
      current?.id === normalized.id ? normalized : current,
    );
  }, []);

  return (
    <RecordContext.Provider
      value={{
        records: recordsState,
        selectedRecord,
        setSelectedRecord,
        currentMonth,
        setCurrentMonth,
        isDog,
        upsertRecord,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};

// Custom Hook: Context 사용을 쉽게 해줌
export const useRecord = (): RecordContextType => {
  const context = useContext(RecordContext);

  if (!context) {
    throw new Error('useRecord must be used within an RecordProvider');
  }
  return context;
};
