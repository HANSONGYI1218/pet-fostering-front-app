import { Button } from '@/shared/ui/button';
import {
  MYPAGE_STEPS,
  MYPAGE_STEP_LABEL,
  type MypageStep,
} from '@/features/mypage/lib/mypage-steps';

export default function MypageMenu({
  currentStep,
  setCurrentStep,
}: {
  currentStep: MypageStep;
  setCurrentStep: (step: MypageStep) => void;
}) {
  return (
    <div className="flex min-h-screen w-96 flex-col items-start gap-10 rounded-2xl bg-white p-10">
      <h1 className="text-xl font-semibold">내 정보</h1>
      <div className="flex w-full flex-col gap-2">
        {MYPAGE_STEPS.map((step) => {
          const isActive = currentStep === step;

          return (
            <Button
              key={step}
              onClick={() => {
                setCurrentStep(step);
              }}
              variant="ghost"
              className={`h-12 w-full justify-start text-lg ${isActive ? 'bg-[#D0EFE0] font-semibold text-[#00592d] hover:bg-[#D0EFE0] hover:text-[#00592d]' : 'font-normal text-neutral-700'}`}
            >
              {MYPAGE_STEP_LABEL[step]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
