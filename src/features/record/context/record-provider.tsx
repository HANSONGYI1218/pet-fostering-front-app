'use client';

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { FosterRecord } from '@/entities/foster-record/foster-record';
import { toDate } from '@/shared/lib/utils';

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

interface RecordContextType {
  records: FosterRecord[];
  selectedRecord: FosterRecord | null;
  setSelectedRecord: Dispatch<SetStateAction<FosterRecord | null>>;
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
  isDog: boolean;
  upsertRecord: (record: FosterRecord) => void;
  removeRecord: (id: string) => void;
  animalId: string;
}

const RecordContext = createContext<RecordContextType | null>(null);

interface RecordProviderProps {
  records: FosterRecord[];
  initialValue: FosterRecord | null;
  isDog: boolean;
  animalId: string;
  children: ReactNode;
}

export function RecordProvider({
  records,
  initialValue,
  isDog,
  animalId,
  children,
}: RecordProviderProps) {
  const normalizedRecords = useMemo(
    () => records.map(normalizeRecord),
    [records],
  );

  const [recordsState, setRecordsState] =
    useState<FosterRecord[]>(normalizedRecords);

  const normalizedInitialRecord = useMemo(
    () => (initialValue ? normalizeRecord(initialValue) : null),
    [initialValue],
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

  const removeRecord = useCallback((recordId: string) => {
    setRecordsState((prev) => prev.filter((record) => record.id !== recordId));
    setSelectedRecord((current) => (current?.id === recordId ? null : current));
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
        removeRecord,
        animalId,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
}

export const useRecord = (): RecordContextType => {
  const context = useContext(RecordContext);

  if (!context) {
    throw new Error('useRecord must be used within a RecordProvider');
  }
  return context;
};
