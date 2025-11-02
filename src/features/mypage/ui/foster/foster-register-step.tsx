'use client';

import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';

import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import RegisterStep01 from './register-step01';
import RegisterStep02 from './register-step02';
import RegisterStep03 from './register-step03';
import Stepper from './stepper';
import {
  validateStep01,
  validateStep02,
  type FosterFormValues,
} from './foster-register-form';

export default function FosterRegisterStep({
  form,
}: {
  form: UseFormReturn<FosterFormValues>;
}) {
  const { control } = useFormContext<FosterFormValues>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPrevHidden, setIsPrevHidden] = useState(true);
  const [isNextHidden, setIsNextHidden] = useState(true);
  const [canNext, setCanNext] = useState(false);

  const [step01Passed, setStep01Passed] = useState(false);
  const [step02Passed, setStep02Passed] = useState(false);

  const type = useWatch({ control, name: 'type' });
  const size = useWatch({ control, name: 'size' });
  const animalAge = useWatch({ control, name: 'animal_age' });

  const fosterEnvironments = useWatch({
    control,
    name: 'foster_environments',
  });
  const specialNotesAnimals = useWatch({
    control,
    name: 'special_notes_animals',
  });
  const fosterPeriod = useWatch({ control, name: 'foster_period' });

  const isStep01Valid = useCallback(
    () =>
      validateStep01({
        type: type ?? [],
        size: size ?? [],
        animal_age: animalAge ?? [],
      }).success,
    [animalAge, size, type],
  );
  const isStep02Valid = useCallback(
    () =>
      validateStep02({
        foster_environments: fosterEnvironments ?? [],
        special_notes_animals: specialNotesAnimals ?? [],
        foster_period: fosterPeriod,
      }).success,
    [fosterEnvironments, fosterPeriod, specialNotesAnimals],
  );

  useEffect(() => {
    setStep01Passed(isStep01Valid());
  }, [isStep01Valid]);

  useEffect(() => {
    setStep02Passed(isStep02Valid());
  }, [isStep02Valid]);

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
        <Card className="cursor-default items-center gap-10 px-8 py-16">
          <h1 className="text-xl font-semibold">
            임시보호자 등록을 시작해보세요.
          </h1>
          <Image
            src="/images/white-poodle-dog6.png"
            width={200}
            height={200}
            alt="white-poodle-dog6"
          />
          <div className="flex flex-col items-center gap-2">
            <span>임시 보호자 등록 전입니다</span>
            <Button
              variant="destructive"
              className="h-10 px-8"
              onClick={handleNext}
            >
              등록하기
            </Button>
          </div>
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
            src="/images/white-poodle-dog6.png"
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
          <Link href="/foster-list">
            <Button variant="destructive" className="my-4 h-10 px-8">
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
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentStep * 100}%)` }}
        >
          {stepComponents.map((step) => (
            <div key={step.index} className="w-full flex-shrink-0">
              {step.component}
            </div>
          ))}
        </div>
      </div>
      <>
        {!isPrevHidden && (
          <Button
            onClick={handlePrev}
            variant="outline"
            className="absolute top-1/2 left-0 size-8 -translate-y-1/2 rounded-full"
          >
            <ArrowLeft />
          </Button>
        )}
        {!isNextHidden && (
          <Button
            onClick={handleNext}
            disabled={!canNext}
            variant="outline"
            className="absolute top-1/2 right-0 size-8 -translate-y-1/2 rounded-full"
          >
            <ArrowRight />
          </Button>
        )}
      </>
    </div>
  );
}
