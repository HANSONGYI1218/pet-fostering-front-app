'use client';

import { format } from 'date-fns';
import { WholeDateArray } from './tr';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useRecord } from '@/providers/record-provider';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { Badge } from '@/components/ui/badge';
import { ko } from 'date-fns/locale';

interface TdProps {
  p: WholeDateArray;
  currentMonth: Date;
}

const RecordSchema = z.object({
  images: z.array(z.string()).optional(),
  content: z.string(),
  health_note: z.string(),
});

const CalendarDialogForm = ({ p, currentMonth }: TdProps) => {
  const recordContext = useRecord();

  const currentRecord =
    recordContext?.records.length > 0
      ? recordContext?.records.find(
          (record: FosterRecord) =>
            format(new Date(record.created_at), 'yyyy-M-d') ===
            format(p.date, 'yyyy-M-d'),
        )
      : null;

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpened, setIsDialogOpended] = useState(false);
  const isToday = format(new Date(), 'yyyy-M-d') === format(p.date, 'yyyy-M-d');

  const isThisMonth =
    format(currentMonth, 'yyyy-M') === format(p.date, 'yyyy-M');

  const isWeekend =
    new Date(p.date).getDay() === 0 || new Date(p.date).getDay() === 6;

  const form = useForm<z.infer<typeof RecordSchema>>({
    resolver: zodResolver(RecordSchema),
    defaultValues: {
      images: [],
      content: '',
      health_note: '',
    },
  });

  useEffect(() => {
    form.reset();
  }, [isDialogOpened]);

  async function onSubmit(data: z.infer<typeof RecordSchema>) {
    console.log('onsubmit');
  }

  return (
    <Dialog
      open={isDialogOpened}
      onOpenChange={(open) => {
        if (isLoading) {
          setIsDialogOpended(true); // 로딩 중이면 강제로 열림 유지
        } else {
          setIsDialogOpended(open); // 기본 동작
        }
      }}
    >
      <DialogTrigger
        disabled={!!currentRecord}
        onClick={() => {
          setIsDialogOpended(true);
        }}
        asChild
      >
        <div
          className={`relative flex h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border ${currentRecord ? 'bg-neutral-200' : 'bg-white'}`}
        >
          <span
            className={`absolute top-3 left-3 font-semibold ${isWeekend ? 'text-red-600' : ''}`}
          >
            {p.formattedDate}
          </span>
          {currentRecord &&
            (recordContext.isDog ? (
              <img
                src="/icons/dog_stamp.svg"
                width={100}
                height={100}
                alt="stamp"
                className="relative z-10"
              />
            ) : (
              <img
                src="/icons/cat_stamp.svg"
                width={100}
                height={100}
                alt="stamp"
                className="relative z-10"
              />
            ))}
        </div>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          if (isLoading) e.preventDefault();
        }}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <DialogHeader className="flex flex-col gap-10">
              <DialogTitle className="flex items-center gap-2">
                <span>돌봄기록 생성</span>
                <Badge variant={'outline'} className="border-neutral-300">
                  {format(p.date, 'M월 d일 (eee)', { locale: ko })}
                </Badge>
              </DialogTitle>
              <div className={`flex w-full flex-col gap-10 px-2`}>
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
                  <FormField
                    control={form.control}
                    name={'content'}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            placeholder={`임시보호중인 동물의 기록을 자유롭게 작성해주세요.

예) 아직은 긴장하는 모습이 있지만, 하루하루 눈에 띄게 적응 중입니다.
특히 오늘은 제 손에 먼저 다가와서 냄새를 맡아주어 기뻤습니다.
주말에는 조금 더 오랜 시간 함께 산책하며 친밀감을 쌓아볼 계획입니다.`}
                            className="resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                    <g clip-path="url(#clip0_2024_5604)">
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
                <FormField
                  control={form.control}
                  name={'health_note'}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Textarea
                          placeholder={`임시보호중인 동물의 건강상태를 작성해주세요.

예) 오전에 식욕이 좋아져 사료를 거의 다 먹었습니다.
오후에는 살짝 설사를 했는데, 한 번 정도였고 이후 상태는 괜찮았습니다.
귀를 자주 긁어서 귀 상태를 체크해볼 필요가 있을 것 같습니다.
오전에 다녀온 병원에서 상태가 점점 좋아진다고 말씀해주셨습니다.`}
                          className="resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </DialogHeader>
            <div className="mt-10 flex w-full items-center justify-end gap-2">
              <Button type="submit" variant={'default'} className="w-24">
                {isLoading ? <Loader2 className="animate-spin" /> : '완료'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialogForm;
