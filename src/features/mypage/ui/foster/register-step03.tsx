'use client';

import { UseFormReturn } from 'react-hook-form';
import z from 'zod';
import { FosterformSchema } from './foster-register-form';
import { Card } from '@/shared/ui/card';
import { Controller } from 'react-hook-form';
import { CheckButton } from '@/features/mypage/ui/foster/check-button';
import { AnimalSize, AnimalType } from '@/entities/animal/animal';
import { AnimalAge } from '@/entities/animal-condition/animal-condition';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { FormControl } from '@/shared/ui/form';
import { Button } from '@/shared/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';

export type FosterformValues = z.infer<typeof FosterformSchema>;

export default function RegisterStep03({
  form,
  handleButtonNext,
}: {
  form: UseFormReturn<FosterformValues>;
  handleButtonNext: () => void;
}) {
  return (
    <Card className="cursor-default gap-12 px-12 py-10">
      <h1 className="text-xl font-semibold">
        마지막이에요! 임시보호 경험을 알려주세요.
      </h1>

      <div className="flex flex-col gap-4">
        <span className="font-medium">
          <span className="mr-1 text-[#00592d]">Q.</span>임시보호
          <span className="ml-1 text-[#00592d]">경험</span>을 알려주세요.
        </span>

        <Controller
          control={form.control}
          name="foster_experiences"
          render={({ field }) => (
            <div className="flex flex-col gap-6">
              {field?.value?.map((experience, index) => (
                <Card
                  key={index}
                  className="relative cursor-default border-[#99D3AF]"
                >
                  <Button className="absolute top-6 right-6 h-6 w-6 rounded-sm bg-[#C1E5CE] p-0 hover:bg-[#C1E5CE]/80">
                    <Trash2
                      className="h-5 w-5 cursor-pointer stroke-[#00592d]"
                      strokeWidth={1.7}
                      onClick={() => {
                        if (field?.value && field?.value?.length > 1) {
                          const newExperiences = field?.value?.filter(
                            (_, i) => i !== index,
                          );
                          field.onChange(newExperiences);
                        } else {
                          field.onChange([
                            {
                              id: '',
                              animal_type: AnimalType.DOG,
                              animal_size: AnimalSize.SMALL,
                              animal_age: AnimalAge.JUVENILE,
                              foster_start_date: undefined,
                              foster_end_date: undefined,
                              organization_name: '',
                              note: '',
                            },
                          ]);
                        }
                      }}
                    />
                  </Button>
                  <div className="flex w-full gap-12">
                    <span className="w-24 text-sm text-neutral-700">
                      동물 종류
                    </span>
                    <CheckButton
                      type="type"
                      isExperience
                      value={experience?.animal_type ?? ''}
                      onChange={(val) => {
                        const newExperiences = [...(field.value ?? [])];
                        const enumValue = val as AnimalType;
                        newExperiences[index] = {
                          ...experience,
                          animal_type: enumValue,
                        };
                        field.onChange(newExperiences);
                      }}
                    />
                  </div>
                  <div className="flex w-full gap-12">
                    <span className="w-24 text-sm text-neutral-700">
                      동물 크기
                    </span>
                    <CheckButton
                      type="size"
                      isExperience
                      value={experience?.animal_size ?? ''}
                      onChange={(val) => {
                        const newExperiences = [...(field.value ?? [])];
                        const enumValue = val as AnimalSize;
                        newExperiences[index] = {
                          ...experience,
                          animal_size: enumValue,
                        };
                        field.onChange(newExperiences);
                      }}
                    />
                  </div>
                  <div className="flex w-full gap-12">
                    <span className="w-24 text-sm text-neutral-700">
                      동물 나이
                    </span>
                    <CheckButton
                      type="age"
                      isExperience
                      value={experience?.animal_age ?? ''}
                      onChange={(val) => {
                        const newExperiences = [...(field.value ?? [])];
                        const enumValue = val as AnimalAge;
                        newExperiences[index] = {
                          ...experience,
                          animal_age: enumValue,
                        };
                        field.onChange(newExperiences);
                      }}
                    />
                  </div>
                  <div className="flex w-full gap-12">
                    <span className="w-24 text-sm text-neutral-700">
                      보호 기간
                    </span>
                    <div className="flex w-full items-center gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'flex-1 pl-3 text-left font-normal',
                                !experience?.foster_start_date &&
                                  'text-muted-foreground',
                              )}
                            >
                              {experience?.foster_start_date ? (
                                format(
                                  experience?.foster_start_date,
                                  'yyyy.MM.dd',
                                )
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  임시보호 시작 날짜
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              experience?.foster_start_date ?? undefined
                            }
                            onSelect={(val) => {
                              if (val) {
                                const newExperiences = [...(field.value ?? [])];
                                newExperiences[index] = {
                                  ...experience,
                                  foster_start_date: val,
                                };
                                field.onChange(newExperiences);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <span className="text-muted-foreground text-sm">-</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'flex-1 pl-3 text-left font-normal',
                                !experience?.foster_end_date &&
                                  'text-muted-foreground',
                              )}
                            >
                              {experience?.foster_end_date ? (
                                format(
                                  experience?.foster_end_date,
                                  'yyyy.MM.dd',
                                )
                              ) : (
                                <span className="text-muted-foreground text-xs">
                                  임시보호 종료 날짜
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={experience?.foster_end_date ?? undefined}
                            onSelect={(val) => {
                              if (val) {
                                const newExperiences = [...(field.value ?? [])];
                                newExperiences[index] = {
                                  ...experience,
                                  foster_end_date: val,
                                };
                                field.onChange(newExperiences);
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="flex w-full gap-12">
                    <span className="w-24 text-sm text-neutral-700">
                      시설 이름
                    </span>
                    <Input
                      placeholder="서울 유기견센터"
                      className="placeholder:text-xs"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        />
        <Button
          variant={'ghost'}
          className="mx-auto h-8 w-8 rounded-full bg-[#C1E5CE] text-[#00592D] hover:bg-[#C1E5CE]/80 hover:text-[#00592D]"
          onClick={() => {
            const currentExperiences =
              form.getValues('foster_experiences') ?? [];
            form.setValue('foster_experiences', [
              ...currentExperiences,
              {
                id: '',
                animal_type: AnimalType.DOG,
                animal_size: AnimalSize.SMALL,
                animal_age: AnimalAge.JUVENILE,
                foster_start_date: undefined,
                foster_end_date: undefined,
                organization_name: '',
                note: '',
              },
            ]);
          }}
        >
          <Plus />
        </Button>
      </div>
      <Button variant={'destructive'} onClick={handleButtonNext}>
        등록 완료하기
      </Button>
    </Card>
  );
}
