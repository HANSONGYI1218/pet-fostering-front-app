import { FosterRecord } from '@/types/foster-record/foster-record';
import React, { createContext, useContext, useState } from 'react';

// Context의 타입 정의
interface RecordContextType {
  records: FosterRecord[];
  selectedRecord: FosterRecord;
  setSelectedRecord: React.Dispatch<React.SetStateAction<FosterRecord>>;
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
  const [selectedRecord, setSelectedRecord] = useState<FosterRecord>(
    initalValue ?? null,
  );

  return (
    <RecordContext.Provider
      value={{
        records,
        selectedRecord,
        setSelectedRecord,
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
