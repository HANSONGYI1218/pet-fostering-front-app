'use client';

import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AnimalType, AnimalSize } from '@/types/animal/animal';
import {
  AnimalAge,
  AnimalSpecialNote,
  AnimalPeriod,
} from '@/types/animal-condition/animal-condition';
import { FosterEnvironment } from '@/types/foster-condition/foster-condition';
import { zodResolver } from '@hookform/resolvers/zod';
import { Resolver, useForm } from 'react-hook-form';
import { FosterConditionItem } from '@/types/foster-condition/foster-condition-api';
import { ChevronRight } from 'lucide-react';
import {
  ANIMAL_AGE_LABEL_KO,
  ANIMAL_SIZE_LABEL_KO,
  ANIMAL_SPECIAL_NOTE_LABEL_KO,
  ANIMAL_TYPE_LABEL_KO,
  FOSTER_ENVIRONMENT_LABEL_KO,
} from '@/constants/enum';
import { Card } from '@/components/ui/card';
import FosterRegisterStep from './foster-register-step';

export const FosterExperienceSchema = z.object({
  id: z.string().optional(),
  animal_type: z.enum(AnimalType).optional(),
  animal_size: z.enum(AnimalSize).optional(),
  animal_age: z.enum(AnimalAge).optional(),
  foster_start_date: z.date().optional(),
  foster_end_date: z.date().optional(),
  organization_name: z.string().optional(),
  note: z.string().optional(),
});

export const FosterformSchema = z.object({
  type: z.array(z.enum(AnimalType)).catch([]),
  size: z.array(z.enum(AnimalSize)).catch([]),
  animal_age: z.array(z.enum(AnimalAge)).catch([]),
  foster_environments: z.array(z.enum(FosterEnvironment)).catch([]),
  special_notes_animals: z.array(z.enum(AnimalSpecialNote)).catch([]),
  foster_period: z.enum(AnimalPeriod),
  foster_experiences: z.array(FosterExperienceSchema).optional(),
});

// Step 1 체크 함수
export const validateStep01 = (data: any) => {
  const step01Schema = FosterformSchema.pick({
    type: true,
    size: true,
    animal_age: true,
  }).refine(
    (data) =>
      data.type.length > 0 &&
      data.size.length > 0 &&
      data.animal_age.length > 0,
    {
      message: 'Type, size, and animal_age must have at least one item each',
      path: ['type', 'size', 'animal_age'],
    },
  );

  return step01Schema.safeParse(data);
};

// Step 2 체크 함수
export const validateStep02 = (data: any) => {
  const step02Schema = FosterformSchema.pick({
    foster_environments: true,
    special_notes_animals: true,
    foster_period: true,
  }).refine(
    (data) =>
      data.foster_environments.length > 0 &&
      data.special_notes_animals.length > 0 &&
      !!data.foster_period,
    {
      message:
        'Foster environments, special notes, and foster period are required',
      path: ['foster_environments', 'special_notes_animals', 'foster_period'],
    },
  );

  return step02Schema.safeParse(data);
};

export default function FosterRegisterForm({
  fosterCondition,
}: {
  fosterCondition: FosterConditionItem | undefined;
}) {
  const form = useForm<z.infer<typeof FosterformSchema>>({
    resolver: zodResolver(FosterformSchema) as unknown as Resolver<
      z.infer<typeof FosterformSchema>
    >,
    defaultValues: {
      type: fosterCondition?.type ?? [],
      size: fosterCondition?.size ?? [],
      animal_age: fosterCondition?.animal_age ?? [],
      foster_environments: fosterCondition?.foster_environments ?? [],
      special_notes_animals: fosterCondition?.special_notes_animals ?? [],
      foster_period: fosterCondition?.foster_period ?? undefined,
      foster_experiences: fosterCondition?.foster_experiences ?? [
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
      ],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(_values: z.infer<typeof FosterformSchema>) {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        {fosterCondition ? (
          <>
            {/* {'임시보호 동물 조건'} */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">임시보호 동물 조건</h1>
              <Card className="cursor-default gap-4 px-8">
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">선호 동물</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value
                              ?.map((type) => ANIMAL_TYPE_LABEL_KO[type])
                              .join(', ')}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
                <hr className="w-full" />
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">선호 크기</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value
                              ?.map((size) => ANIMAL_SIZE_LABEL_KO[size])
                              .join(', ')}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
                <hr className="w-full" />
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="animal_age"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">선호 나이</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value
                              ?.map((age) => ANIMAL_AGE_LABEL_KO[age])
                              .join(', ')}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
              </Card>
            </div>
            {/* {'임시보호자 환경'} */}
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">임시보호자 환경</h1>
              <Card className="cursor-default gap-4 px-8">
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="foster_environments"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">임보자 환경</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value
                              ?.map(
                                (environment) =>
                                  FOSTER_ENVIRONMENT_LABEL_KO[environment],
                              )
                              .join(', ')}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
                <hr className="w-full" />
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="foster_period"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">임보 가능 기간</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
                <hr className="w-full" />
                <div className="flex w-full items-center justify-between">
                  <FormField
                    control={form.control}
                    name="special_notes_animals"
                    render={({ field }) => (
                      <FormItem className="flex w-full gap-10">
                        <FormLabel className="w-36">임보 가능 상태</FormLabel>
                        <FormControl>
                          <span className="text-neutral-700">
                            {field?.value
                              ?.map(
                                (note) => ANIMAL_SPECIAL_NOTE_LABEL_KO[note],
                              )
                              .join(', ')}
                          </span>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <ChevronRight className="h-5 w-5 cursor-pointer stroke-neutral-400" />
                </div>
              </Card>
            </div>
          </>
        ) : (
          <FosterRegisterStep form={form} />
        )}
      </form>
    </Form>
  );
}
