'use client';

import { format } from 'date-fns';
import { WholeDateArray } from './tr';
import { Loader2, Plus } from 'lucide-react';
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
import { Card } from '@/components/ui/card';
import { RecordContent } from '../record-content';
import { RecordHealthNote } from '../record-health-note';

interface TdProps {
  p: WholeDateArray;
  currentMonth: Date;
  setCurrentMonth: any;
}

const RecordSchema = z.object({
  images: z.array(z.string()).optional(),
  content: z.string(),
  health_note: z.string(),
});

const CalendarDialogForm = ({ p, currentMonth, setCurrentMonth }: TdProps) => {
  const recordContext = useRecord();
  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);

  const currentRecord =
    recordContext?.records.length > 0
      ? recordContext?.records.find(
          (record: FosterRecord) =>
            format(new Date(record.created_at), 'yyyy-M-d') ===
            format(p.date, 'yyyy-M-d'),
        )
      : null;

  const [isLoading, setIsLoading] = useState(false);
  const isToday = format(new Date(), 'yyyy-M-d') === format(p.date, 'yyyy-M-d');
  const isPasted = new Date(p.date) <= new Date();
  const isThisMonth =
    format(currentMonth, 'yyyy-M') === format(p.date, 'yyyy-M');

  const isWeekend =
    new Date(p.date).getDay() === 0 || new Date(p.date).getDay() === 6;

  const form = useForm<z.infer<typeof RecordSchema>>({
    resolver: zodResolver(RecordSchema),
    defaultValues: {
      images: currentRecord?.images ?? [],
      content: currentRecord?.content ?? '',
      health_note: currentRecord?.health_note ?? '',
    },
  });

  async function onSubmit(data: z.infer<typeof RecordSchema>) {
    console.log('onsubmit');
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            currentRecord
              ? recordContext?.setSelectedRecord(currentRecord)
              : recordContext?.setSelectedRecord(null);
            recordContext?.setCurrentMonth(p.date);

            if (p.date.getMonth() !== recordContext.currentMonth.getMonth()) {
              setCurrentMonth(p.date);
            }
          }}
          className={`relative flex h-[120px] w-full ${isPasted ? 'cursor-pointer' : 'cursor-default'} flex-col items-center justify-center gap-3 rounded-lg border ${isToday ? 'bg-[#E9FAF1] hover:bg-[#E9FAF1]/70' : currentRecord ? 'bg-neutral-200 hover:bg-neutral-100' : 'bg-white hover:bg-[#00592d]/5'}`}
        >
          {/* {isToday && (
            <div className="absolute top-0 left-0 h-full w-2 rounded-l-lg bg-[#298C5B]" />
          )} */}
          <span
            className={`absolute top-3 left-3 font-semibold ${
              isWeekend
                ? isThisMonth
                  ? 'text-red-600'
                  : 'text-red-600/40'
                : isThisMonth
                  ? 'text-neutral-800'
                  : 'text-neutral-300'
            }`}
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
        </Button>
      </DialogTrigger>
      {isPasted && (
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
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex w-full flex-col gap-0.5">
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
                          <div className="grid w-full grid-cols-3 gap-2">
                            {!currentRecord &&
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
                                      onChange={(e: any) => {
                                        const files = e.target.files;
                                        const selectedFiles = Array.from(files); // File[]

                                        if (files) {
                                          // 선택된 파일들을 Array로 변환하고 URL을 생성
                                          const videoPaths = Array.from(
                                            files,
                                          ).map((file: any) =>
                                            URL.createObjectURL(file),
                                          );

                                          // field.value와 videoPaths를 합친 배열을 직접 전달
                                          const updatedFiles = [
                                            ...videoPaths,
                                            ...(field?.value ?? []),
                                          ];
                                          setAdditionalFiles(
                                            (prevFiles: any) => [
                                              ...selectedFiles, // 새로운 파일들을 추가
                                              ...prevFiles, // 기존 파일들을 그대로 넣음
                                            ],
                                          );

                                          field.onChange(updatedFiles); // 배열을 바로 전달
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
                                  onClick={() => {
                                    const deleteImage = field?.value?.filter(
                                      (v: any) => v !== image,
                                    );
                                    if (deleteImage) {
                                      setAdditionalFiles((prevFiles: any) => {
                                        const updatedFiles = [
                                          ...(prevFiles?.filter(
                                            (_: any, indx: any) =>
                                              indx !== index,
                                          ) ?? []),
                                        ];

                                        return updatedFiles; // 수정된 배열을 반환
                                      });
                                    }

                                    field?.onChange(deleteImage);
                                  }}
                                  className={`absolute -top-2 -right-2 z-10 h-6 w-6 rounded-full bg-neutral-300 p-0 ${currentRecord ? 'hidden' : 'flex'}`}
                                >
                                  <Plus
                                    className="h-4 w-4 rotate-45 text-white"
                                    strokeWidth={2.5}
                                  />
                                </Button>
                                <img
                                  src={image}
                                  alt="preview"
                                  className={`relative z-0 h-32 rounded-xl object-cover`}
                                />
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
                            placeholder={`임시보호중인 동물의 기록을 자유롭게 작성해주세요.

예) 아직은 긴장하는 모습이 있지만, 하루하루 눈에 띄게 적응 중입니다.
특히 오늘은 제 손에 먼저 다가와서 냄새를 맡아주어 기뻤습니다.
주말에는 조금 더 오랜 시간 함께 산책하며 친밀감을 쌓아볼 계획입니다.`}
                            className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
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
                            placeholder={`임시보호중인 동물의 건강상태를 작성해주세요.

예) 오전에 식욕이 좋아져 사료를 거의 다 먹었습니다.
오후에는 살짝 설사를 했는데, 한 번 정도였고 이후 상태는 괜찮았습니다.
귀를 자주 긁어서 귀 상태를 체크해볼 필요가 있을 것 같습니다.
오전에 다녀온 병원에서 상태가 점점 좋아진다고 말씀해주셨습니다.`}
                            className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </RecordHealthNote>
              </DialogHeader>
              <div className="mt-10 flex w-full items-center justify-end gap-2">
                {currentRecord ? (
                  <Button
                    type="submit"
                    variant={'outline_black'}
                    className="w-24"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : '수정'}
                  </Button>
                ) : (
                  <Button type="submit" variant={'default'} className="w-24">
                    {isLoading ? <Loader2 className="animate-spin" /> : '완료'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CalendarDialogForm;
