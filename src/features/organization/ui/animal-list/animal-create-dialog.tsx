'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Dot, Plus } from 'lucide-react';
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
import {
  AnimalType,
  AnimalSize,
  AnimalGender,
  AnimalStatus,
} from '@/entities/animal/animal';
import { Card } from '@/shared/ui/card';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Calendar } from '@/shared/ui/calendar';
import Image from 'next/image';
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
import AniamlCreateProgress from './animal-create-progress';
import { Textarea } from '@/shared/ui/textarea';
import {
  AnimalEnvironment,
  AnimalHealth,
  AnimalPersonality,
  AnimalSpecialNote,
} from '@/entities/animal-condition/animal-condition';
import Chip from '@/shared/widgets/form/chip';
import { useEmergencyReasonReset } from './hooks/use-emergency-reason-reset';

const AnimalCreateformSchema = z.object({
  name: z.string().min(1, {
    message: '보호동물의 이름을 작성해 주세요.',
  }),
  type: z.nativeEnum(AnimalType),
  size: z.nativeEnum(AnimalSize),
  gender: z.nativeEnum(AnimalGender),
  status: z.nativeEnum(AnimalStatus),
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
  isEmergency: z.boolean(),
  emergency_reason: z.string(),
  animal_healths: z.array(z.nativeEnum(AnimalHealth)),
  animal_personalitys: z.array(z.nativeEnum(AnimalPersonality)),
  animal_environments: z.array(z.nativeEnum(AnimalEnvironment)),
  special_notes_animals: z.array(z.nativeEnum(AnimalSpecialNote)),
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
      status: AnimalStatus.WAITING,
      images: [],
      breed: '',
      birth_date: new Date(),
      remark: '',
      isEmergency: false,
      emergency_reason: '',
      animal_healths: [] as AnimalHealth[],
      animal_personalitys: [] as AnimalPersonality[],
      animal_environments: [] as AnimalEnvironment[],
      special_notes_animals: [] as AnimalSpecialNote[],
      organization_id: '1',
    },
  });
  const contentRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth', // 부드럽게 스크롤
      });
    }
  }, [currentPage]);

  useEmergencyReasonReset(form);

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

  const isStep3Valid =
    !form.watch('isEmergency') || // 비응급이면 그냥 통과
    (form.watch('isEmergency') &&
      form.watch('emergency_reason')?.trim().length > 0);

  // 2. Define a submit handler.
  function onSubmit(_values: z.infer<typeof AnimalCreateformSchema>) {}

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
            ) : currentPage === 1 ? (
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
            ) : (
              <div className="flex flex-col gap-10">
                <div className="flex flex-col gap-1 rounded-lg bg-neutral-100 px-6 py-4">
                  <span className="text-lg font-semibold text-red-500">
                    🚨보호동물의 긴급도를 체크해주세요.
                  </span>
                  <span className="text-neutral-700">
                    다른 긴급한 보호동물들의 빠른 임시보호가 이루어 질 수 있도록
                    <br />
                    긴급도를 신중히 체크해주세요.
                  </span>
                </div>
                <FormField
                  control={form.control}
                  name="isEmergency"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>보호동물의 임시보호가 긴급합니까?</FormLabel>
                        <FormControl>
                          <SelectedButton
                            first={{
                              key: true,
                              word: '예',
                            }}
                            third={{
                              key: false,
                              word: '아니요',
                            }}
                            value={field?.value === true ? true : false}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {form.watch('isEmergency') === true && (
                  <div className="flex flex-col gap-4">
                    <FormField
                      control={form.control}
                      name="emergency_reason"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>긴급한 이유를 선택해주세요.</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="긴급한 이유를 선택해주세요." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="w-full">
                                  <SelectItem value="euthanasia_is_not_far_away">
                                    안락사 기간이 얼마 안 남은 경우
                                  </SelectItem>
                                  <SelectItem value="treatment_needed">
                                    치료가 시급하거나 병원 진료가 반드시 필요한
                                    경우
                                  </SelectItem>
                                  <SelectItem value="unable_to_survive_own">
                                    어린 새끼나 고령으로 인해 스스로 생존하기
                                    힘든 경우
                                  </SelectItem>
                                  <SelectItem value="abuse_exposure_to_risk">
                                    당장 보호받지 못하면 위험에 노출되는 경우
                                  </SelectItem>
                                  <SelectItem value="failure_of_guardian">
                                    보호자가 갑작스러운 환경 변화(이사, 입원
                                    등)로 돌봄이 어려운 경우
                                  </SelectItem>
                                  <SelectItem value="prolonged_stress_in_a_shelter">
                                    장기간 보호소에 있을 경우 스트레스가
                                    심해지는 동물
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <div className="flex flex-col gap-3 rounded-lg bg-neutral-100 p-4">
                      <span>긴급 이유 예시</span>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          안락사 기간이 얼마 안 남은 경우
                        </span>
                        <span className="pl-5">
                          예) 안락사가 일주일밖에 남지 않은 경우
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          치료가 시급하거나 병원 진료가 반드시 필요한 경우
                        </span>
                        <span className="pl-5">
                          예) 고열, 호흡곤란, 출산, 수술 후 회복 필요 등
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          어린 새끼나 고령으로 인해 스스로 생존하기 힘든 경우
                        </span>
                        <span className="pl-5">
                          예) 젖먹이, 15살 이상 노령견, 눈, 귀 장애나 퇴화 등
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          당장 보호받지 못하면 위험에 노출되는 경우
                        </span>
                        <span className="pl-5">
                          예: 길 위 방치, 학대 환경, 교통사고 위험 등
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          보호자가 갑작스러운 환경 변화(이사, 입원 등)로 돌봄이
                          어려운 경우
                        </span>
                        <span className="pl-5">
                          예) 입원 예정, 해외 이사, 사망 등
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1">
                          <Dot className="h-4 w-4" />
                          장기간 보호소에 있을 경우 스트레스가 심해지는 동물
                        </span>
                        <span className="pl-5">
                          예) 분리 불안, 스트레스, 발작 등 문제행동
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="mt-10">
              {(currentPage === 1 || currentPage === 2) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentPage === 1) setCurrentPage(0);
                    else setCurrentPage(1);
                  }}
                  className="w-24"
                >
                  이전으로
                </Button>
              )}
              {(currentPage === 0 || currentPage === 1) && (
                <Button
                  type="button"
                  disabled={
                    (currentPage === 0 && !isStep1Valid) ||
                    (currentPage === 1 && !isStep2Valid)
                  }
                  onClick={() => {
                    if (currentPage === 0) setCurrentPage(1);
                    else setCurrentPage(2);
                  }}
                  className="w-40"
                >
                  다음으로
                </Button>
              )}
              {currentPage === 2 && (
                <Button
                  type="submit"
                  disabled={currentPage === 2 && !isStep3Valid}
                  className="w-40"
                >
                  프로필 등록
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
