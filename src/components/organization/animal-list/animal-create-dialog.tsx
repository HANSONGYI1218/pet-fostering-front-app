'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  AnimalType,
  AnimalSize,
  AnimalGender,
  FosterState,
} from '@/types/animal/animal';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { ko } from 'date-fns/locale/ko';
import SelectedButton from '@/components/common/selected-button';
import {
  FOSTER_ENVIRONMENT_LABEL_KO,
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITYS_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
} from '@/constants/enum';
import AniamlCreateProgress from './animal-create-progress';
import { Textarea } from '@/components/ui/textarea';
import {
  ANIMAL_ENVIRONMENT,
  ANIMAL_HEALTH,
  ANIMAL_PERSONALITYS,
  ANIMAL_SPECIAL_NOTES,
} from '@/types/animal-condition/animal-condition';
import Chip from '@/components/common/chip';

const AnimalCreateformSchema = z.object({
  name: z.string().min(1, {
    message: '보호동물의 이름을 작성해 주세요.',
  }), //
  type: z.enum(AnimalType), //
  size: z.enum(AnimalSize), //
  gender: z.enum(AnimalGender), //
  status: z.enum(FosterState), //
  images: z.array(z.string()).min(1), //
  breed: z.string().min(1, {
    //
    message: '보호동물의 품종을 작성해 주세요.',
  }),
  birth_date: z.date(), //
  remark: z.string().min(1, {
    message: '보호동물의 특성을 작성해 주세요.',
  }),
  isEmergency: z.boolean(),
  animal_healths: z.array(z.enum(ANIMAL_HEALTH)),
  animal_personalitys: z.array(z.enum(ANIMAL_PERSONALITYS)),
  foster_environments: z.array(z.enum(ANIMAL_ENVIRONMENT)),
  special_notes_animals: z.array(z.enum(ANIMAL_SPECIAL_NOTES)),
  organization_id: z.string(),
});

export function AnimalCreateDialog() {
  const form = useForm<z.infer<typeof AnimalCreateformSchema>>({
    resolver: zodResolver(AnimalCreateformSchema),
    defaultValues: {
      name: '',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      status: FosterState.IN_PROGRESS,
      images: [],
      breed: '',
      birth_date: new Date(),
      remark: '',
      isEmergency: false,
      animal_healths: [] as ANIMAL_HEALTH[],
      animal_personalitys: [] as ANIMAL_PERSONALITYS[],
      foster_environments: [] as ANIMAL_ENVIRONMENT[],
      special_notes_animals: [] as ANIMAL_SPECIAL_NOTES[],
      organization_id: '1',
    },
  });
  const [currentPage, setCurrentPage] = useState(0);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof AnimalCreateformSchema>) {
    //  animal_condition: {
    //   animal_healths: z.array(z.string()).min(1),
    //   animal_personalitys: z.array(z.string()).min(1),
    //   foster_environments: z.array(z.string()).min(1),
    //   special_notes_animals: z.array(z.string()).min(1),
    // }
    console.log(values);
  }

  return (
    <Dialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <DialogTrigger asChild>
            <Button variant="outline_green" className="h-10 text-[#00592d]">
              <Plus />
              보호 동물 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-10 sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>보호 동물 추가</DialogTitle>
            </DialogHeader>
            <AniamlCreateProgress currentIndex={currentPage} />
            {currentPage === 0 ? (
              <div className="flex flex-col gap-10">
                <FormField
                  control={form.control}
                  name={'images'}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-col">
                        <FormLabel>프로필 사진</FormLabel>
                        <span className="text-xs font-normal text-neutral-500">
                          * 사진은 최대 3장까지 등록 가능합니다.
                        </span>
                      </div>
                      <div className="grid w-full grid-cols-3 gap-2">
                        {(!field?.value ||
                          (field?.value && field?.value?.length < 3)) && (
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
                                  const files: any = e.target.files;
                                  if (!files) return;

                                  const urls = Array.from(files).map(
                                    (file: any) => URL.createObjectURL(file),
                                  );

                                  // react-hook-form 값에 string[]으로 저장
                                  field.onChange([
                                    ...(field.value ?? []),
                                    ...urls,
                                  ]);
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

                                field?.onChange(deleteImage);
                              }}
                              className="absolute -top-2 -right-2 z-10 flex h-6 w-6 rounded-full bg-neutral-300 p-0"
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
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>이름</FormLabel>
                      <FormControl>
                        <Input placeholder="꽃남이" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>생년월일</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn(
                                'w-full text-left text-sm font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value && isValid(new Date(field.value)) ? (
                                format(new Date(field.value), 'yyyy.MM.dd', {
                                  locale: ko,
                                })
                              ) : (
                                <span className="text-sm">
                                  생년월일을 선택해 주세요.
                                </span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            locale={ko}
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date('1900-01-01')
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>성별</FormLabel>
                      <FormControl>
                        <SelectedButton
                          first={{
                            key: AnimalGender.MALE,
                            word: ANIMAL_GENDER_LABEL_KO[AnimalGender.MALE],
                          }}
                          third={{
                            key: AnimalGender.FEMALE,
                            word: ANIMAL_GENDER_LABEL_KO[AnimalGender.FEMALE],
                          }}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>종</FormLabel>
                      <FormControl>
                        <SelectedButton
                          first={{
                            key: AnimalType.DOG,
                            word: ANIMAL_TYPE_LABEL_KO[AnimalType.DOG],
                          }}
                          third={{
                            key: AnimalType.CAT,
                            word: ANIMAL_TYPE_LABEL_KO[AnimalType.CAT],
                          }}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>품종</FormLabel>
                      <FormControl>
                        <Input placeholder="말티즈" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>크기</FormLabel>
                      <FormControl>
                        <SelectedButton
                          first={{
                            key: AnimalSize.SMALL,
                            word: ANIMAL_SIZE_LABEL_KO[AnimalSize.SMALL],
                          }}
                          second={{
                            key: AnimalSize.MEDIUM,
                            word: ANIMAL_SIZE_LABEL_KO[AnimalSize.MEDIUM],
                          }}
                          third={{
                            key: AnimalSize.LARGE,
                            word: ANIMAL_SIZE_LABEL_KO[AnimalSize.LARGE],
                          }}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={'remark'}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>특이사항</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`임시보호중인 동물의 특징 및 특성을 자유롭게 작성해주세요.

ex) 꼬리 만지는 걸 싫어함.
나이가 좀 있어 각별한 관리가 필요함.
심장병으로인해 매일 약을 챙겨먹어야 함.`}
                          className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-10">
                <FormField
                  control={form.control}
                  name="animal_personalitys"
                  render={({ field }) => {
                    const current: ANIMAL_PERSONALITYS[] = Array.isArray(
                      field.value,
                    )
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>보호동물의 성격</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(ANIMAL_PERSONALITYS).map(
                              (personality) => {
                                const label =
                                  ANIMAL_PERSONALITYS_LABEL_KO[personality];
                                const selected =
                                  current?.includes(personality) ?? false;

                                return (
                                  <Chip
                                    key={personality}
                                    value={label}
                                    isSelected={selected}
                                    onToggle={() => {
                                      const next = selected
                                        ? current?.filter(
                                            (v) => v !== personality,
                                          ) // 제거
                                        : [...current, personality]; // 추가
                                      field.onChange(next);
                                    }}
                                  />
                                );
                              },
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="foster_environments"
                  render={({ field }) => {
                    const current: ANIMAL_ENVIRONMENT[] = Array.isArray(
                      field.value,
                    )
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>임시보호자의 환경 및 조건</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(ANIMAL_ENVIRONMENT).map(
                              (environment) => {
                                const label =
                                  FOSTER_ENVIRONMENT_LABEL_KO[environment];
                                const selected =
                                  current?.includes(environment) ?? false;

                                return (
                                  <Chip
                                    key={environment}
                                    value={label}
                                    isSelected={selected}
                                    onToggle={() => {
                                      const next = selected
                                        ? current?.filter(
                                            (v) => v !== environment,
                                          ) // 제거
                                        : [...current, environment]; // 추가
                                      field.onChange(next);
                                    }}
                                  />
                                );
                              },
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="animal_healths"
                  render={({ field }) => {
                    const current: ANIMAL_HEALTH[] = Array.isArray(field.value)
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>임시보호자의 환경 및 조건</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(ANIMAL_HEALTH).map((health) => {
                              const label = ANIMAL_HEALTH_LABEL_KO[health];
                              const selected =
                                current?.includes(health) ?? false;

                              return (
                                <Chip
                                  key={health}
                                  value={label}
                                  isSelected={selected}
                                  onToggle={() => {
                                    const next = selected
                                      ? current?.filter((v) => v !== health) // 제거
                                      : [...current, health]; // 추가
                                    field.onChange(next);
                                  }}
                                />
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
            <DialogFooter className="mt-10">
              {currentPage === 0 ? (
                <Button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                  }}
                  className="w-40"
                >
                  다음으로
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(0);
                    }}
                    className="w-24"
                  >
                    이전으로
                  </Button>
                  <Button type="submit" className="w-40">
                    프로필 등록
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
