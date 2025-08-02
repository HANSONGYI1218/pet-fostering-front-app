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
import { useEffect, useRef, useState } from 'react';
import { ko } from 'date-fns/locale';

export default function RecordDetail() {
  const [viewType, setViewType] = useState('record');
  const recordContext = useRecord();
  const [openItems, setOpenItems] = useState<string[]>(
    recordContext?.records?.map((_, indx) => `item-${indx}`) || [],
  );
  const currentMonth = recordContext?.currentMonth ?? new Date();

  const recordRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const targetIndex = recordContext?.records?.findIndex((record) => {
      const recordDay = format(new Date(record.created_at), 'yyyy.MM.dd');
      const currentDay = format(recordContext?.currentMonth, 'yyyy.MM.dd');
      return recordDay === currentDay;
    });

    if (
      targetIndex !== undefined &&
      targetIndex !== -1 &&
      recordContext?.records
    ) {
      const targetRecord = recordContext.records[targetIndex];
      const refEl = recordRefs.current[targetRecord.created_at];
      if (refEl) {
        const topOffset = refEl.getBoundingClientRect().top + window.scrollY;
        const offset = 100;
        window.scrollTo({
          top: topOffset - offset,
          behavior: 'smooth',
        });

        // 아코디언 열기
        const itemKey = `item-${targetIndex}`;
        setOpenItems((prev) =>
          prev.includes(itemKey) ? prev : [...prev, itemKey],
        );
      }
    }
  }, [recordContext?.currentMonth]);

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
      <Accordion type="multiple" value={openItems} onValueChange={setOpenItems}>
        {recordContext?.records?.map((record, indx) => (
          <AccordionItem
            value={`item-${indx}`}
            key={record.created_at}
            ref={(el) => {
              recordRefs.current[record.created_at] = el;
            }}
          >
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
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.2857 14.2858C15.2325 14.2858 16 13.5182 16 12.5715V3.42864C16 2.48186 15.2325 1.71436 14.2857 1.71436H1.71429C0.767512 1.71436 0 2.48186 0 3.42864V12.5715C0 13.5182 0.767512 14.2858 1.71429 14.2858H14.2857Z"
                      fill="#9AD9BA"
                    />
                    <path
                      d="M10.8593 7.35306C11.7852 7.35306 12.5358 6.60246 12.5358 5.67653C12.5358 4.75061 11.7852 4 10.8593 4C9.93336 4 9.18274 4.75061 9.18274 5.67653C9.18274 6.60246 9.93336 7.35306 10.8593 7.35306Z"
                      fill="#298C5B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.71429 14.2856H9.80889C9.45402 12.3955 8.43913 10.693 6.94531 9.48176C5.4515 8.27055 3.57593 7.6295 1.65327 7.67297C1.09855 7.67149 0.544967 7.72316 0.000103359 7.82727L0 12.5714C0 13.5179 0.767911 14.2852 1.71429 14.2856C1.71457 14.2856 1.714 14.2856 1.71429 14.2856Z"
                      fill="#298C5B"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.83948 10.5896C10.5117 11.6255 10.9816 12.79 11.213 14.0223C11.2294 14.11 11.2375 14.1982 11.2375 14.286H14.2858C15.2302 14.286 15.9963 13.5222 16 12.5786V10.6165C15 10.2788 13.9516 10.1069 12.8962 10.1074C11.8563 10.1052 10.8246 10.2685 9.83948 10.5896Z"
                      fill="#298C5B"
                    />
                  </svg>
                  오늘의 사진
                </div>
                <div className="grid w-full grid-cols-3 gap-2">
                  {record?.images?.map((image, indx) => (
                    <Card className="p-0 shadow-none" key={indx}>
                      <img
                        src={image}
                        alt="preview"
                        className={`relative z-0 h-64 rounded-xl object-cover`}
                      />
                    </Card>
                  ))}
                </div>
              </div>
              <div className="flex w-full gap-6">
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-2 font-medium">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.08847 0.0483398C2.0123 0.0483398 1.13989 0.920749 1.13989 1.99692V14.0027C1.13989 15.0789 2.0123 15.9514 3.08847 15.9514H12.9114C13.9876 15.9514 14.86 15.0789 14.86 14.0027V1.99692C14.86 0.920749 13.9876 0.0483398 12.9114 0.0483398H3.08847Z"
                        fill="#9AD9BA"
                      />
                      <path
                        d="M1.13989 14.0029C1.13989 15.0791 2.0123 15.9515 3.08847 15.9515H12.9114C13.9876 15.9515 14.86 15.0791 14.86 14.0029V12H1.13989V14.0029Z"
                        fill="#298C5B"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41418 3.29757C4.41418 2.82419 4.79793 2.44043 5.27133 2.44043H10.7285C11.2019 2.44043 11.5856 2.82419 11.5856 3.29757C11.5856 3.77096 11.2019 4.15472 10.7285 4.15472H5.27133C4.79793 4.15472 4.41418 3.77096 4.41418 3.29757ZM4.41418 6.29667C4.41418 5.82328 4.79793 5.43953 5.27133 5.43953H10.7285C11.2019 5.43953 11.5856 5.82328 11.5856 6.29667C11.5856 6.77005 11.2019 7.15381 10.7285 7.15381H5.27133C4.79793 7.15381 4.41418 6.77005 4.41418 6.29667ZM5.27133 8.43858C4.79793 8.43858 4.41418 8.82234 4.41418 9.29572C4.41418 9.76911 4.79793 10.1529 5.27133 10.1529H8.54564C9.01903 10.1529 9.40278 9.76911 9.40278 9.29572C9.40278 8.82234 9.01903 8.43858 8.54564 8.43858H5.27133Z"
                        fill="#298C5B"
                      />
                    </svg>
                    오늘의 돌봄 기록
                  </div>
                  <Card className="min-h-32 cursor-default p-3 shadow-none">
                    {record?.content}
                  </Card>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <div className="flex items-center gap-2 font-medium">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_2024_5604)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M0.916347 0.75C0.44296 0.75 0.0592041 1.13376 0.0592041 1.60714V5.71429C0.0592041 7.95133 1.67869 9.81011 3.80921 10.1822V10.8089C3.80921 13.6167 6.08538 15.8928 8.89318 15.8928C11.701 15.8928 13.9772 13.6167 13.9772 10.8089V7.25C13.9772 6.77662 13.5934 6.39286 13.1201 6.39286C12.6467 6.39286 12.2629 6.77662 12.2629 7.25V10.8089C12.2629 12.6699 10.7542 14.1785 8.89318 14.1785C7.03216 14.1785 5.52349 12.6699 5.52349 10.8089V10.1549C7.58313 9.72638 9.13064 7.90105 9.13064 5.71429V1.60714C9.13064 1.13376 8.74688 0.75 8.27349 0.75H7.02349C6.5501 0.75 6.16635 1.13376 6.16635 1.60714C6.16635 2.08053 6.5501 2.46429 7.02349 2.46429H7.41635V5.71429C7.41635 7.27251 6.15315 8.53571 4.59492 8.53571C3.03668 8.53571 1.77349 7.27251 1.77349 5.71429V2.46429H2.16635C2.63973 2.46429 3.02349 2.08053 3.02349 1.60714C3.02349 1.13376 2.63973 0.75 2.16635 0.75H0.916347Z"
                          fill="#9AD9BA"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M13.7499 2.26621C12.2191 1.9157 10.6941 2.87245 10.3436 4.40315C9.99309 5.93386 10.9498 7.45889 12.4805 7.80939C14.0112 8.15991 15.5363 7.20317 15.8868 5.67246C16.2373 4.14175 15.2806 2.61672 13.7499 2.26621Z"
                          fill="#298C5B"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_2024_5604">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                    건강 상태
                  </div>
                  <Card className="min-h-32 cursor-default p-3 shadow-none">
                    {record?.health_note}
                  </Card>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
