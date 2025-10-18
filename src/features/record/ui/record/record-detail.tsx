'use client';

import { useRecord } from '@/features/record/context/record-provider';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { useState } from 'react';
import Image from 'next/image';
import { ko } from 'date-fns/locale';
import { RecordImages } from '@/shared/widgets/record/record-images';
import { RecordContent } from '@/shared/widgets/record/record-content';
import { RecordHealthNote } from '@/shared/widgets/record/record-health-note';
import { toDate } from '@/shared/lib/utils';
import EmptyBox from '@/shared/widgets/feedback/empty-box';

export default function RecordDetail() {
  const [viewType, setViewType] = useState('record');
  const recordContext = useRecord();
  const currentMonth = recordContext?.currentMonth ?? new Date();

  const filteredRecords = recordContext?.records.filter(
    (record) =>
      new Date(record.created_at).getMonth() === currentMonth.getMonth(),
  );

  return (
    <Card className="cursor-default gap-8 border-none p-8">
      <div className="flex items-center gap-4">
        <Button
          variant={viewType === 'record' ? 'default' : 'outline'}
          onClick={() => {
            setViewType('record');
          }}
          className={`h-9 rounded-lg max-md:text-sm md:h-11`}
        >
          {format(currentMonth, 'M월')} 돌봄기록
        </Button>
        <Button
          variant={viewType === 'gallary' ? 'default' : 'outline'}
          onClick={() => {
            setViewType('gallary');
          }}
          className={`h-9 rounded-lg max-md:text-sm md:h-11`}
        >
          사진 갤러리
        </Button>
      </div>
      {viewType === 'record' ? (
        filteredRecords?.length > 0 ? (
          <Accordion
            type="multiple"
            defaultValue={filteredRecords?.map((_, indx) => `item-${indx}`)}
          >
            {filteredRecords?.map((record, indx) => (
              <AccordionItem value={`item-${indx}`} key={indx}>
                <AccordionTrigger className="flex h-16 items-center justify-start gap-1 text-base font-semibold md:text-lg [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-neutral-800">
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
                    {format(toDate(record?.created_at), 'M월 dd일 E요일', {
                      locale: ko,
                    })}{' '}
                    돌봄기록
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mb-6 flex flex-col gap-6 rounded-2xl bg-neutral-50 p-6">
                  <RecordImages images={record?.images} />

                  <div className="flex w-full flex-col gap-6 md:flex-row">
                    <RecordContent content={record?.content} />
                    <RecordHealthNote health_note={record?.health_note} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <EmptyBox text="돌봄기록이 없어요." />
        )
      ) : filteredRecords?.length > 0 ? (
        <div className="flex flex-col">
          {filteredRecords?.map((record, indx) => (
            <div
              key={indx}
              className={`flex flex-col gap-2 ${indx !== filteredRecords?.length - 1 && 'border-b'} py-6`}
            >
              <span className="text-base font-semibold md:text-lg">
                {format(toDate(record?.created_at), 'yyyy.MM.dd')}
              </span>
              <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
                {record?.images?.map((image, index) => (
                  <div key={index} className="relative h-40 w-full">
                    <Image
                      src={image ?? '/images/placeholder.png'}
                      alt={`record-${record?.created_at}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      unoptimized={!image?.startsWith('/')}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyBox text="사진이 없어요." />
      )}
    </Card>
  );
}
