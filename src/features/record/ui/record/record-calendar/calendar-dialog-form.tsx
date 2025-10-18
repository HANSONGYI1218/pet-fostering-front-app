'use client';

import { format } from 'date-fns';
import { WholeDateArray } from './tr';
import { Loader2, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { useRecord } from '@/features/record/context/record-provider';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';
import { FosterRecord } from '@/types/foster-record/foster-record';
import { Badge } from '@/shared/ui/badge';
import { ko } from 'date-fns/locale';
import { Card } from '@/shared/ui/card';
import { RecordContent } from '@/shared/widgets/record/record-content';
import { RecordHealthNote } from '@/shared/widgets/record/record-health-note';
import { cn, toDate } from '@/shared/lib/utils';

import type { Dispatch, SetStateAction } from 'react';

interface TdProps {
  p: WholeDateArray;
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
}

const RecordSchema = z.object({
  images: z.array(z.string()).optional(),
  content: z.string(),
  health_note: z.string(),
});

const CalendarDialogForm = ({ p, currentMonth, setCurrentMonth }: TdProps) => {
  const recordContext = useRecord();

  const currentRecord =
    recordContext?.records.length > 0
      ? recordContext?.records.find(
          (record: FosterRecord) =>
            format(toDate(record.created_at), 'yyyy-M-d') ===
            format(p.date, 'yyyy-M-d'),
        )
      : null;

  const isToday = format(new Date(), 'yyyy-M-d') === format(p.date, 'yyyy-M-d');
  const isPasted = new Date(p.date) <= new Date();
  const isThisMonth =
    format(currentMonth, 'yyyy-M') === format(p.date, 'yyyy-M');

  const isWeekend =
    new Date(p.date).getDay() === 0 || new Date(p.date).getDay() === 6;

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(currentRecord ? false : true);

  const defaultValues = useMemo(
    () => ({
      images: currentRecord?.images ?? [],
      content: currentRecord?.content ?? '',
      health_note: currentRecord?.health_note ?? '',
    }),
    [currentRecord],
  );

  const form = useForm<z.infer<typeof RecordSchema>>({
    resolver: zodResolver(RecordSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const resolveRecordId = () => {
    if (currentRecord?.id) {
      return currentRecord.id;
    }

    if (
      typeof crypto !== 'undefined' &&
      typeof crypto.randomUUID === 'function'
    ) {
      return crypto.randomUUID();
    }

    return `record-${Date.now()}`;
  };

  const onSubmit = async (data: z.infer<typeof RecordSchema>) => {
    if (!recordContext) {
      return;
    }

    const recordId = resolveRecordId();
    const createdAt = currentRecord?.created_at ?? p.date;
    const nextRecord: FosterRecord = {
      id: recordId,
      images: data.images ?? [],
      content: data.content,
      health_note: data.health_note,
      created_at: toDate(createdAt),
      updated_at: new Date(),
    };

    recordContext.upsertRecord(nextRecord);
    recordContext.setSelectedRecord(nextRecord);
    recordContext.setCurrentMonth(toDate(nextRecord.created_at));

    form.reset({
      images: nextRecord.images,
      content: nextRecord.content,
      health_note: nextRecord.health_note,
    });

    setOpen(false);
    setIsEdit(false);
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            const setSelectedRecord = recordContext?.setSelectedRecord;
            if (setSelectedRecord) {
              setSelectedRecord(currentRecord ?? null);
            }
            const setRecordMonth = recordContext?.setCurrentMonth;
            if (setRecordMonth) {
              setRecordMonth(p.date);
            }

            if (p.date.getMonth() !== recordContext.currentMonth.getMonth()) {
              setCurrentMonth(p.date);
            }
          }}
          className={`relative flex h-12 w-full p-0 md:h-20 ${isToday && 'max-md:bg-[#15894B]'} ${isPasted ? 'cursor-pointer' : 'cursor-default'} flex-col items-center justify-center gap-3 rounded-lg border ${currentRecord ? 'bg-[#F9F9F9] hover:bg-neutral-100' : 'bg-white hover:bg-neutral-100'}`}
        >
          {isToday && (
            <div className="absolute top-2.5 left-2 h-6 w-6 rounded-full bg-[#15894B] max-md:hidden" />
          )}
          <span
            className={cn(
              'absolute top-1.5 left-1.5 text-xs font-normal md:top-3 md:left-3 md:text-sm',
              isToday
                ? 'text-white'
                : isWeekend
                  ? isThisMonth
                    ? 'text-red-600'
                    : 'text-red-600/40'
                  : isThisMonth
                    ? 'text-neutral-800'
                    : 'text-neutral-100',
            )}
          >
            {p.formattedDate}
          </span>
          {currentRecord && (
            <div className="relative h-[44px] w-[44px] max-sm:hidden xl:h-[80px] xl:w-[80px]">
              <Image
                src={
                  recordContext.isDog
                    ? '/images/dog_stamp.png'
                    : '/images/cat_stamp.png'
                }
                alt="stamp"
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {currentRecord && (
            <div className="h-2 w-2 translate-y-1 rounded-full bg-[#00592d] stroke-[#00592d] sm:hidden" />
          )}
        </Button>
      </DialogTrigger>
      {isPasted && (
        <DialogContent
          onInteractOutside={(event) => {
            if (isSubmitting) event.preventDefault();
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
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col items-start gap-0.5">
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
                      <span className="text-sm font-normal text-neutral-500">
                        사진은 최대 6장까지 등록 가능합니다.
                      </span>
                    </div>
                    <FormField
                      control={form.control}
                      name={'images'}
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
                            {isEdit &&
                              (!field?.value ||
                                (field?.value && field?.value?.length < 6)) && (
                                <Card className="relative z-0 h-32 items-center justify-center overflow-hidden shadow-none">
                                  <div className="absolute z-10 flex h-full w-full">
                                    <label
                                      htmlFor="additionalImgs"
                                      className="flex w-full cursor-pointer items-center justify-center"
                                    >
                                      <Plus className="h-10 w-10 text-neutral-300" />
                                    </label>
                                    <input
                                      type="file"
                                      id="additionalImgs"
                                      accept="image/*"
                                      multiple
                                      onChange={(
                                        event: ChangeEvent<HTMLInputElement>,
                                      ) => {
                                        const { files } = event.target;

                                        if (files) {
                                          const imagePaths = Array.from(
                                            files,
                                          ).map((file) =>
                                            URL.createObjectURL(file),
                                          );

                                          field.onChange([
                                            ...(field?.value ?? []),
                                            ...imagePaths,
                                          ]);
                                        }
                                      }}
                                      className="hidden"
                                    />
                                  </div>
                                </Card>
                              )}
                            {field?.value?.map((image, index) => (
                              <Card
                                className="relative p-0 shadow-none"
                                key={index}
                              >
                                <Button
                                  type="button"
                                  onClick={() => {
                                    const deleteImage = field?.value?.filter(
                                      (value) => value !== image,
                                    );
                                    field?.onChange(deleteImage);
                                  }}
                                  className={`absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-neutral-300 p-0 ${currentRecord ? 'hidden' : 'flex'}`}
                                >
                                  <Plus
                                    className="h-4 w-4 rotate-45 text-white"
                                    strokeWidth={2.5}
                                  />
                                </Button>
                                <div className="relative h-32 w-full">
                                  <Image
                                    src={image}
                                    alt={`record-image-${index + 1}`}
                                    fill
                                    className="rounded-xl object-cover"
                                    sizes="(min-width: 1024px) 20vw, 100vw"
                                  />
                                </div>
                              </Card>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <RecordContent>
                  <FormField
                    control={form.control}
                    name={'content'}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            disabled={!isEdit}
                            placeholder={`임시보호중인 동물의 기록을 자유롭게 작성해주세요.

예) 아직은 긴장하는 모습이 있지만, 하루하루 눈에 띄게 적응 중입니다.
특히 오늘은 제 손에 먼저 다가와서 냄새를 맡아주어 기뻤습니다.
주말에는 조금 더 오랜 시간 함께 산책하며 친밀감을 쌓아볼 계획입니다.`}
                            className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:opacity-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </RecordContent>
                <RecordHealthNote>
                  <FormField
                    control={form.control}
                    name={'health_note'}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Textarea
                            disabled={!isEdit}
                            placeholder={`임시보호중인 동물의 건강상태를 작성해주세요.

예) 오전에 식욕이 좋아져 사료를 거의 다 먹었습니다.
오후에는 살짝 설사를 했는데, 한 번 정도였고 이후 상태는 괜찮았습니다.
귀를 자주 긁어서 귀 상태를 체크해볼 필요가 있을 것 같습니다.
오전에 다녀온 병원에서 상태가 점점 좋아진다고 말씀해주셨습니다.`}
                            className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:opacity-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </RecordHealthNote>
              </DialogHeader>
              <DialogFooter className="mt-6">
                {isEdit ? (
                  <>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant={'outline_black'}
                        onClick={() => {
                          setIsEdit(false);
                        }}
                        className="w-24"
                      >
                        취소
                      </Button>
                    </DialogClose>
                    <Button
                      type="submit"
                      variant={'default'}
                      className="w-24"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        '완료하기'
                      )}
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant={'outline_black'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEdit(true);
                    }}
                    className="w-24"
                  >
                    수정하기
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CalendarDialogForm;
