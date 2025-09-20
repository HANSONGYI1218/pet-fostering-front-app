'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { addMonths, format, subMonths } from 'date-fns';
import CalendarHeader from '@/components/record/record-calendar/calendar-header';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { ko } from 'date-fns/locale/ko';
import { RecordImages } from '@/components/record/record-images';
import { RecordContent } from '@/components/record/record-content';
import { RecordHealthNote } from '@/components/record/record-health-note';

const RecordFiltered = ({ records }: { records: FosterRecord[] }) => {
  //현재 보고 있는 달
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [filteredRecords, setFilteredRecords] =
    useState<FosterRecord[]>(records);

  //이전 달로 이동(currentMonth가 이전 달로 바뀜)
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  //다음 달로 이동(currentMonth가 다음 달로 바뀜)
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  useEffect(() => {
    if (!records) return;

    const results = records.filter((v) => {
      return (
        v.created_at.getMonth() === currentMonth.getMonth() &&
        v.created_at.getFullYear() === currentMonth.getFullYear()
      );
    });

    results.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

    setFilteredRecords(results);
  }, [currentMonth, records]);

  return (
    <div className="flex w-full flex-1 flex-col gap-6 rounded-lg bg-white p-10">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-xl font-semibold">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.56529 0.807087C7.07157 1.34172 11.037 3.1162 12 4.0792C12.963 3.1162 16.9284 1.34197 21.4347 0.80733C22.8449 0.640012 24 1.80215 24 3.22231V16.9366C24 18.3567 22.8394 19.4885 21.4421 19.7422C18.2863 20.3151 15.6616 21.8285 13.9872 23.0247C12.8316 23.8502 11.1672 23.8491 10.0116 23.0237C8.33712 21.8277 5.71294 20.3148 2.55794 19.7419C1.16062 19.4882 0 18.3566 0 16.9363V3.22206C0 1.8019 1.15502 0.639768 2.56529 0.807087Z"
              fill="#9AD9BA"
            />
            <path
              d="M10.9297 23.4791V3.33301C11.5605 3.68636 12.4417 3.68637 13.0725 3.33304V23.4794C12.3814 23.6981 11.6209 23.698 10.9297 23.4791Z"
              fill="#004C26"
            />
          </svg>{' '}
          돌봄기록
        </span>
        <CalendarHeader
          currentMonth={currentMonth}
          prevMonth={prevMonth}
          nextMonth={nextMonth}
        />{' '}
      </div>
      {filteredRecords && filteredRecords?.length > 0 ? (
        <Accordion
          type="multiple"
          defaultValue={filteredRecords?.map((_, indx) => `item-${indx}`)}
        >
          {filteredRecords?.map((record, indx) => (
            <AccordionItem value={`item-${indx}`} key={indx}>
              <AccordionTrigger className="flex h-16 items-center justify-start gap-1 text-lg font-semibold [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-neutral-800">
                <div className="flex w-56 items-center gap-2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 3.5H3C1.9 3.5 1 4.4 1 5.5V18.5C1 19.6 1.9 20.5 3 20.5H21C22.1 20.5 23 19.6 23 18.5V5.5C23 4.4 22.1 3.5 21 3.5ZM3 18.5V5.5H11V18.5H3ZM21 18.5H13V5.5H21V18.5ZM14 9H20V10.5H14V9ZM14 11.5H20V13H14V11.5ZM14 14H20V15.5H14V14Z"
                      fill="black"
                    />
                  </svg>
                  {format(record?.created_at, 'M월 dd일 E요일', {
                    locale: ko,
                  })}{' '}
                  돌봄기록
                </div>
              </AccordionTrigger>
              <AccordionContent className="mb-6 flex flex-col gap-6 rounded-2xl bg-neutral-50 p-6">
                <RecordImages images={record?.images} className="h-64" />

                <div className="flex w-full gap-6">
                  <RecordContent content={record?.content} />
                  <RecordHealthNote health_note={record?.health_note} />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div>없어요~!</div>
      )}
    </div>
  );
};

export default RecordFiltered;
