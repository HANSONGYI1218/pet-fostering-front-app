import { FosterRecord } from '@/types/foster-record/foster-record';
import React, { createContext, useContext, useState } from 'react';

// Context의 타입 정의
interface RecordContextType {
  records: FosterRecord[];
  selectedRecord: FosterRecord | null;
  setSelectedRecord: React.Dispatch<React.SetStateAction<FosterRecord | null>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  isDog: boolean;
}

const RecordContext = createContext<RecordContextType | null>(null);

// Provider 컴포넌트
export const RecordProvider: React.FC<{
  records: FosterRecord[];
  initalValue: FosterRecord;
  isDog: boolean;
  children: React.ReactNode;
}> = ({ records, initalValue, isDog, children }) => {
  const [selectedRecord, setSelectedRecord] = useState<FosterRecord | null>(
    initalValue ?? null,
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

  return (
    <RecordContext.Provider
      value={{
        records,
        selectedRecord,
        setSelectedRecord,
        currentMonth,
        setCurrentMonth,
        isDog,
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
