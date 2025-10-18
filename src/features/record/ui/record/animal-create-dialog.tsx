'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { AnimalType, AnimalSize, AnimalGender } from '@/entities/animal/animal';
import { Card } from '@/shared/ui/card';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { format, isValid } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { ko } from 'date-fns/locale/ko';
import SelectedButton from '@/shared/widgets/form/selected-button';
import {
  ANIMAL_ENVIRONMENT_LABEL_KO,
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_HEALTH_LABEL_KO,
  ANIMAL_PERSONALITY_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  ANIMAL_SPECIAL_NOTE_LABEL_KO,
} from '@/shared/constants/enum';
import { Textarea } from '@/shared/ui/textarea';
import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import Chip from '@/shared/widgets/form/chip';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import AniamlCreateProgress from '@/features/organization/ui/animal-list/animal-create-progress';

const AnimalCreateformSchema = z.object({
  name: z.string().min(1, {
    message: '보호동물의 이름을 작성해 주세요.',
  }),
  type: z.nativeEnum(AnimalType),
  size: z.nativeEnum(AnimalSize),
  gender: z.nativeEnum(AnimalGender),
  images: z.array(z.string()).min(1),
  breed: z.string().min(1, {
    message: '보호동물의 품종을 작성해 주세요.',
  }),
  introduction: z.string().min(1, {
    message: '보호동물의 소개를 작성해 주세요.',
  }),
  birth_date: z.date(),
  remark: z.string().min(1, {
    message: '보호동물의 특성을 작성해 주세요.',
  }),
  animal_healths: z.array(z.nativeEnum(AnimalHealth)),
  animal_personalitys: z.array(z.nativeEnum(AnimalPersonality)),
  animal_environments: z.array(z.nativeEnum(AnimalEnvironment)),
  special_notes_animals: z.array(z.nativeEnum(AnimalSpecialNote)),
});

export function AniamlCreateDialog() {
  const form = useForm<z.infer<typeof AnimalCreateformSchema>>({
    resolver: zodResolver(AnimalCreateformSchema),
    defaultValues: {
      name: '',
      type: AnimalType.DOG,
      size: AnimalSize.SMALL,
      gender: AnimalGender.MALE,
      images: [],
      breed: '',
      birth_date: new Date(),
      remark: '',
      animal_healths: [] as AnimalHealth[],
      animal_personalitys: [] as AnimalPersonality[],
      animal_environments: [] as AnimalEnvironment[],
      special_notes_animals: [] as AnimalSpecialNote[],
    },
  });
  const contentRef = useRef<HTMLDivElement>(null);
  const token = resolveStoredAccessToken();

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드럽게 스크롤
      });
    }
  }, [currentPage]);

  const isStep1Valid =
    form.watch('images')?.length > 0 &&
    form.watch('name')?.trim().length > 0 &&
    form.watch('birth_date') &&
    form.watch('breed')?.trim().length > 0 &&
    form.watch('type') &&
    form.watch('size') &&
    form.watch('remark')?.trim().length > 0 &&
    form.watch('introduction')?.trim().length > 0;

  const isStep2Valid =
    form.watch('animal_healths')?.length > 0 &&
    form.watch('animal_personalitys')?.length > 0 &&
    form.watch('animal_environments')?.length > 0 &&
    form.watch('special_notes_animals')?.length > 0;

  // 2. Define a submit handler.
  function onSubmit(_values: z.infer<typeof AnimalCreateformSchema>) {}

  return (
    <Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full w-full space-y-8"
        >
          <DialogTrigger asChild>
            <Card className="group relative mb-6 w-full cursor-default items-center justify-center overflow-hidden bg-transparent max-md:h-80">
              <div className="absolute top-0 left-0 z-0 h-full w-full bg-black opacity-0 group-hover:opacity-85" />
              <div className="relative flex flex-col items-center justify-center gap-2">
                <Plus className="h-10 w-10" stroke="#a3a3a3" strokeWidth={1} />
                <span className="text-center text-neutral-700 group-hover:text-white">
                  {token ? (
                    <>
                      임시보호 기록을 작성할
                      <br />
                      보호동물을 추가해보세요!
                    </>
                  ) : (
                    <>
                      돌봄 기록을 작성하려면
                      <br />
                      로그인이 필요해요!
                    </>
                  )}
                </span>
              </div>
            </Card>
          </DialogTrigger>
          {/* {token && ( */}
          <DialogContent ref={contentRef} className="gap-10 sm:max-w-xl">
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
                      <div className="flex flex-col gap-1">
                        <FormLabel>프로필 사진</FormLabel>
                        <span className="text-xs font-normal text-neutral-500">
                          * 사진은 최대 3장까지 등록 가능합니다.
                        </span>
                      </div>
                      <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
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
                                onChange={(
                                  event: ChangeEvent<HTMLInputElement>,
                                ) => {
                                  const { files } = event.target;
                                  if (!files) return;

                                  const urls = Array.from(files).map((file) =>
                                    URL.createObjectURL(file),
                                  );

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
                              type="button"
                              onClick={() => {
                                const deleteImage = field?.value?.filter(
                                  (value) => value !== image,
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
                            <div className="relative h-32 w-full">
                              <Image
                                src={image}
                                alt={`preview-${index + 1}`}
                                fill
                                className="rounded-xl object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                unoptimized
                              />
                            </div>
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
                  name={'introduction'}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>소개</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`보호동물의 장점을 자신있게 소개해주세요.

ex) 우리 이쁜 꽃남이는 정말 똑똑한 아이에요.
애교가 많고 너무너무 순하고 착해요.
사랑 많은 임시 보호자 곁에서 멋지게 자랄 거예요.`}
                          className="min-h-32 resize-none whitespace-pre-wrap disabled:cursor-default disabled:border-none"
                          {...field}
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
                          placeholder={`보호동물의 특징 및 특성을 자유롭게 작성해주세요.

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
                    const current: AnimalPersonality[] = Array.isArray(
                      field.value,
                    )
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>보호동물의 성격</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(AnimalPersonality).map(
                              (personality) => {
                                const label =
                                  ANIMAL_PERSONALITY_LABEL_KO[personality];
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
                  name="animal_environments"
                  render={({ field }) => {
                    const current: AnimalEnvironment[] = Array.isArray(
                      field.value,
                    )
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>임시보호자의 환경 및 조건</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(AnimalEnvironment).map(
                              (environment) => {
                                const label =
                                  ANIMAL_ENVIRONMENT_LABEL_KO[environment];
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
                    const current: AnimalHealth[] = Array.isArray(field.value)
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>임시보호자의 환경 및 조건</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(AnimalHealth).map((health) => {
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
                <FormField
                  control={form.control}
                  name="special_notes_animals"
                  render={({ field }) => {
                    const current: AnimalSpecialNote[] = Array.isArray(
                      field.value,
                    )
                      ? field.value
                      : [];
                    return (
                      <FormItem>
                        <FormLabel>유의사항</FormLabel>
                        <FormControl>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(AnimalSpecialNote).map((note) => {
                              const label = ANIMAL_SPECIAL_NOTE_LABEL_KO[note];
                              const selected = current?.includes(note) ?? false;

                              return (
                                <Chip
                                  key={note}
                                  value={label}
                                  isSelected={selected}
                                  onToggle={() => {
                                    const next = selected
                                      ? current?.filter((v) => v !== note) // 제거
                                      : [...current, note]; // 추가
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
              {currentPage === 1 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPage(0);
                  }}
                  className="w-24"
                >
                  이전으로
                </Button>
              )}
              {currentPage === 0 ? (
                <Button
                  type="button"
                  disabled={currentPage === 0 && !isStep1Valid}
                  onClick={() => {
                    setCurrentPage(1);
                  }}
                  className="w-40"
                >
                  다음으로
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={currentPage === 1 && !isStep2Valid}
                  className="w-40"
                >
                  프로필 등록
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
          {/* )} */}
        </form>
      </Form>
    </Dialog>
  );
}
