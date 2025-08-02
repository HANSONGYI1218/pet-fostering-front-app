'use client';

import { FosterRecord } from '@/types/foster-record/foster-record';
import RecordCalendar from './record-calendar/record-calendar';
import { RecordProvider } from '@/providers/record-provider';
import RecordDetail from './record-detail';
import { useEffect, useState } from 'react';
import { ArrowUp, ChevronUp } from 'lucide-react';

export default function RecordContainer({
  records,
  isDog,
}: {
  records: FosterRecord[];
  isDog: boolean;
}) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative flex w-full flex-col gap-6">
      <RecordProvider
        records={records}
        initalValue={records[records.length - 1]}
        isDog={isDog}
      >
        <RecordCalendar />
        <RecordDetail />
      </RecordProvider>

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed right-12 bottom-12 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 p-3 text-white shadow-lg transition hover:bg-neutral-800/90"
        >
          <ArrowUp className="h-7 w-7" />
        </button>
      )}
    </div>
  );
}
