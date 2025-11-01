'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarIcon, Loader2, Plus } from 'lucide-react';
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
import type { AnimalUpsertPayload } from '@/entities/animal/animal-api';
import { Card } from '@/shared/ui/card';
import { ChangeEvent, useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Calendar } from '@/shared/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { ko } from 'date-fns/locale/ko';
import SelectedButton from '@/shared/widgets/form/selected-button';
import {
  ANIMAL_GENDER_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
} from '@/shared/constants/enum';
import { Textarea } from '@/shared/ui/textarea';
import { resolveStoredAccessToken } from '@/lib/auth/session';
import { toast } from 'sonner';
import { createAnimal, updateAnimal } from '@/features/foster/api/foster';
import NeedLoginBadge from '@/shared/widgets/feedback/need-login-badge';
import { useParams } from 'next/navigation';

type AniamlProps = {
  name: string;
  size: AnimalSize;
  type: AnimalType;
  breed: string;
  birth_date: Date;
  gender: AnimalGender;
  remark: string;
  images: string[];
  introduction: string;
  current_foster_start_date: Date;
  current_foster_end_date: Date;
};

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
  birth_date: z.date(),
  introduction: z.string().optional(),
  remark: z.string().optional(),
  current_foster_start_date: z.date().optional(),
  current_foster_end_date: z.date().optional(),
});

export function AniamlCreateDialog({ animal }: { animal?: AniamlProps }) {
  const defaultAnimalValues = useMemo(
    () => ({
      name: animal?.name ?? '',
      type: animal?.type ?? AnimalType.DOG,
      size: animal?.size ?? AnimalSize.SMALL,
      gender: animal?.gender ?? AnimalGender.MALE,
      images: animal?.images ?? [],
      breed: animal?.breed ?? '',
      birth_date: animal?.birth_date ? new Date(animal.birth_date) : undefined,
      remark: animal?.remark ?? '',
      introduction: animal?.introduction ?? '',
      current_foster_start_date: animal?.current_foster_start_date
        ? new Date(animal.current_foster_start_date)
        : undefined,
      current_foster_end_date: animal?.current_foster_end_date
        ? new Date(animal.current_foster_end_date)
        : undefined,
    }),
    [animal],
  );

  const form = useForm<z.infer<typeof AnimalCreateformSchema>>({
    resolver: zodResolver(AnimalCreateformSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: defaultAnimalValues,
    criteriaMode: 'all',
    shouldUseNativeValidation: false,
  });
  const params = useParams();
  const animalId = params?.id as string;

  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const closeDialog = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (_values: z.infer<typeof AnimalCreateformSchema>) => {
    if (!token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }

    const payload: AnimalUpsertPayload = {
      name: _values?.name ?? undefined,
      size: _values?.size ?? undefined,
      type: _values?.type ?? undefined,
      breed: _values?.breed ?? undefined,
      birthDate: _values?.birth_date ?? undefined,
      gender: _values?.gender ?? undefined,
      introduction: _values?.introduction ?? undefined,
      remark: _values?.remark ?? undefined,
      currentFosterStartDate: _values?.current_foster_start_date ?? undefined,
      currentFosterEndDate: _values?.current_foster_end_date ?? undefined,
      status: AnimalStatus.IN_PROGRESS,
    };

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (animal) {
        await updateAnimal(token, animalId, payload);
      } else {
        await createAnimal(token, payload);
      }

      closeDialog();
    } catch {
      toast('잠시 뒤 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && !token) {
      toast('로그인 후 이용해 주세요.');
      return;
    }

    setOpen(nextOpen);
  };

  useEffect(() => {
    setToken(resolveStoredAccessToken());
  }, []);

  useEffect(() => {
    form.reset(defaultAnimalValues);
  }, [defaultAnimalValues, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="relative flex flex-col items-center gap-1">
          {token ? null : <NeedLoginBadge />}
          <Button
            variant={animal ? 'outline_black' : `destructive`}
            disabled={!token}
            className={animal && 'w-full'}
          >
            {animal ? '프로필 수정' : '동물 추가'}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col space-y-8"
          >
            <DialogHeader>
              <DialogTitle>보호 동물 추가</DialogTitle>
            </DialogHeader>
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
                        <Card className="relative p-0 shadow-none" key={index}>
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
                            {field?.value ? (
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
              <div className="flex w-full flex-col gap-2 md:flex-row">
                <FormField
                  control={form.control}
                  name="current_foster_start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>임시보호 시작일</FormLabel>
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
                              {field?.value ? (
                                format(new Date(field.value), 'yyyy.MM.dd', {
                                  locale: ko,
                                })
                              ) : (
                                <span className="text-sm">
                                  날짜를 선택해 주세요.
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
                  name="current_foster_end_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-1 flex-col">
                      <FormLabel>임시보호 종료일</FormLabel>
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
                              {field?.value ? (
                                format(new Date(field.value), 'yyyy.MM.dd', {
                                  locale: ko,
                                })
                              ) : (
                                <span className="text-sm">
                                  날짜를 선택해 주세요.
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
              </div>
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
            <DialogFooter className="mt-10">
              <DialogClose asChild>
                <Button variant="outline_black" type="button" className="w-24">
                  취소
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className="w-40"
              >
                {isLoading ? (
                  <Loader2 className="animate-pulse" />
                ) : animal ? (
                  '수정 완료'
                ) : (
                  '동물 등록'
                )}
              </Button>
            </DialogFooter>
          </form>{' '}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
