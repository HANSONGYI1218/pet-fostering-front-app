'use client';

import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';
import z from 'zod';
import {
  FosterformSchema,
  validateStep01,
  validateStep02,
} from './foster-register-form';
import RegisterStep01 from './register-step01';
import RegisterStep02 from './register-step02';
import RegisterStep03 from './register-step03';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Stepper from './stepper';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export type FosterformValues = z.infer<typeof FosterformSchema>;

export default function FosterRegisterStep({
  form,
}: {
  form: UseFormReturn<FosterformValues>;
}) {
  const { control } = useFormContext<FosterformValues>();
  const [currentStep, setCurrentStep] = useState(0);

  // 버튼 노출 제어
  const [isPrevHidden, setIsPrevHidden] = useState(true);
  const [isNextHidden, setIsNextHidden] = useState(true);
  const [canNext, setCanNext] = useState(false);

  // 유효성 상태
  const [step01Passed, setStep01Passed] = useState(false);
  const [step02Passed, setStep02Passed] = useState(false);

  // Watch values
  const type = useWatch({ control, name: 'type' });
  const size = useWatch({ control, name: 'size' });
  const animal_age = useWatch({ control, name: 'animal_age' });

  const foster_environments = useWatch({
    control,
    name: 'foster_environments',
  });
  const special_notes_animals = useWatch({
    control,
    name: 'special_notes_animals',
  });
  const foster_period = useWatch({ control, name: 'foster_period' });

  // Step validation
  const isStep01Valid = useCallback(
    () =>
      validateStep01({
        type: type ?? [],
        size: size ?? [],
        animal_age: animal_age ?? [],
      }).success,
    [animal_age, size, type],
  );
  const isStep02Valid = useCallback(
    () =>
      validateStep02({
        foster_environments: foster_environments ?? [],
        special_notes_animals: special_notes_animals ?? [],
        foster_period,
      }).success,
    [foster_environments, foster_period, special_notes_animals],
  );

  useEffect(() => {
    setStep01Passed(isStep01Valid());
  }, [isStep01Valid]);

  useEffect(() => {
    setStep02Passed(isStep02Valid());
  }, [isStep02Valid]);

  // currentStep이 바뀔 때 버튼 상태 & canNext 업데이트
  useEffect(() => {
    setIsNextHidden(
      currentStep === 0 || currentStep === 3 || currentStep === 4,
    );
    setIsPrevHidden(
      currentStep === 0 || currentStep === 1 || currentStep === 4,
    );

    if (currentStep === 1) setCanNext(step01Passed);
    else if (currentStep === 2) setCanNext(step02Passed);
    else setCanNext(true);
  }, [currentStep, step01Passed, step02Passed]);

  const handlePrev = () => setCurrentStep((s) => s - 1);
  const handleNext = () => setCurrentStep((s) => s + 1);

  const stepComponents = [
    {
      index: 0,
      component: (
        <Card className="cursor-default items-center gap-4 px-8 py-10">
          <Image
            src="/images/foster-register.png"
            width={280}
            height={280}
            alt="foster-register"
          />
          <span>임시 보호자 등록 전입니다</span>
          <Button
            variant={'destructive'}
            className="h-10 px-8"
            onClick={handleNext}
          >
            등록하기
          </Button>
        </Card>
      ),
    },
    {
      index: 1,
      component: <RegisterStep01 form={form} isValidStep01={step01Passed} />,
    },
    {
      index: 2,
      component: <RegisterStep02 form={form} isValidStep02={step02Passed} />,
    },
    {
      index: 3,
      component: <RegisterStep03 form={form} handleButtonNext={handleNext} />,
    },
    {
      index: 4,
      component: (
        <Card className="cursor-default items-center gap-2 px-8 py-10">
          <Image
            src="/images/apply-accept.png"
            width={160}
            height={160}
            alt="foster-register"
            className="py-10"
          />
          <span className="text-lg font-semibold">
            임시 보호자 <span className="text-[#00592d]">등록</span>을
            완료했어요!
          </span>
          <span>보호동물 임시보호를 신청해보세요.</span>
          <Link href={'/foster-list'}>
            <Button variant={'destructive'} className="my-4 h-10 px-8">
              보호동물 보러가기
            </Button>
          </Link>
        </Card>
      ),
    },
  ];

  return (
    <div className="relative flex flex-col gap-2">
      <Stepper currentStep={currentStep} />
      {/* Step Content */}
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {stepComponents.map((step, index) => (
            <div key={index} className="w-full flex-shrink-0">
              {step.component}
            </div>
          ))}
        </div>
      </div>
      <>
        {!isPrevHidden && (
          <Button
            onClick={handlePrev}
            variant={'outline'}
            className="absolute top-1/2 left-0 size-8 -translate-y-1/2 rounded-full"
          >
            <ArrowLeft />
          </Button>
        )}
        {!isNextHidden && (
          <Button
            onClick={handleNext}
            disabled={!canNext}
            variant={'outline'}
            className="absolute top-1/2 right-0 size-8 -translate-y-1/2 rounded-full"
          >
            <ArrowRight />
          </Button>
        )}
      </>
    </div>
  );
}
