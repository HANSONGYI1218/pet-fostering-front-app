'use client';

import { useRecord } from '@/providers/record-provider';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { format } from 'date-fns';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import { ko } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '../ui/badge';
import { RecordImages } from './record-images';
import { RecordContent } from './record-content';
import { RecordHealthNote } from './record-health-note';
import Image from 'next/image';

export default function RecordDetail() {
  const [viewType, setViewType] = useState('record');
  const recordContext = useRecord();
  const currentMonth = recordContext?.currentMonth ?? new Date();

  return (
    <Card className="cursor-default gap-8 border-none p-8">
      <div className="flex items-center gap-4">
        <Button
          variant={'outline_green'}
          onClick={() => {
            setViewType('record');
          }}
          className={`h-12 rounded-xl ${viewType === 'record' && 'bg-[#00592d] text-white hover:bg-[#00592d]'}`}
        >
          {format(currentMonth, 'M월')} 돌봄기록
        </Button>
        <Button
          variant={'outline_green'}
          onClick={() => {
            setViewType('gallary');
          }}
          className={`h-12 rounded-xl ${viewType === 'gallary' && 'bg-[#00592d] text-white hover:bg-[#00592d]'}`}
        >
          {format(currentMonth, 'M월')} 사진 갤러리
        </Button>
      </div>
      {viewType === 'record' ? (
        <Accordion
          type="multiple"
          defaultValue={recordContext?.records?.map(
            (_, indx) => `item-${indx}`,
          )}
        >
          {recordContext?.records?.map((record, indx) => (
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
                  {format(record?.created_at, 'M월 dd일 E요일', { locale: ko })}{' '}
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
        <div className="grid min-h-[600px] w-full grid-cols-4 gap-6">
          {recordContext?.records?.map((record, indx) => (
            <Dialog key={indx}>
              <DialogTrigger className="group relative cursor-pointer overflow-hidden rounded-lg">
                <div className="relative flex h-56">
                  <div className="absolute top-0 left-0 flex h-full w-full bg-black opacity-0 group-hover:opacity-50" />
                  <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col items-start justify-between p-6 opacity-0 group-hover:opacity-100">
                    <span className="text-white">
                      {format(record?.created_at, 'yyyy.MM.dd')}
                    </span>
                    <span className="line-clamp-3 text-start text-white">
                      {record?.content}
                    </span>
                  </div>
                  <div className="relative h-full w-full">
                    <Image
                      src={record?.images[0] ?? '/images/placeholder.png'}
                      alt={`record-${record?.created_at}`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 20vw, 50vw"
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="gap-10">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <span>돌봄기록 생성</span>
                    <Badge variant={'outline'} className="border-neutral-300">
                      {format(record?.created_at, 'M월 d일 (eee)', {
                        locale: ko,
                      })}
                    </Badge>
                  </DialogTitle>
                </DialogHeader>
                <div className={`flex w-full flex-col gap-10 px-2`}>
                  <RecordImages images={record?.images} />
                  <RecordContent content={record?.content} />
                  <RecordHealthNote health_note={record?.health_note} />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </Card>
  );
}
