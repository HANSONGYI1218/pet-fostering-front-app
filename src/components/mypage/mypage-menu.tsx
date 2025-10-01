import { Button } from '../ui/button';

export default function MypageMeue({
  currentStep,
  setCurrentStep,
}: {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}) {
  return (
    <div className="flex min-h-screen w-96 flex-col items-start gap-10 rounded-2xl bg-white p-10">
      <h1 className="text-xl font-semibold">내 정보</h1>
      <div className="flex w-full flex-col gap-2">
        <Button
          onClick={() => {
            setCurrentStep('profile');
          }}
          variant={'ghost'}
          className={`h-12 w-full justify-start text-lg ${currentStep === 'profile' ? 'bg-[#D0EFE0] font-semibold text-[#00592d] hover:bg-[#D0EFE0] hover:text-[#00592d]' : 'font-normal text-neutral-700'}`}
        >
          프로필
        </Button>
        <Button
          onClick={() => {
            setCurrentStep('foster');
          }}
          variant={'ghost'}
          className={`h-12 w-full justify-start text-lg ${currentStep === 'foster' ? 'bg-[#D0EFE0] font-semibold text-[#00592d] hover:bg-[#D0EFE0] hover:text-[#00592d]' : 'font-normal text-neutral-700'}`}
        >
          임시보호자
        </Button>
        <Button
          onClick={() => {
            setCurrentStep('record');
          }}
          variant={'ghost'}
          className={`h-12 w-full justify-start text-lg ${currentStep === 'record' ? 'bg-[#D0EFE0] font-semibold text-[#00592d] hover:bg-[#D0EFE0] hover:text-[#00592d]' : 'font-normal text-neutral-700'}`}
        >
          활동 기록
        </Button>
        <Button
          onClick={() => {
            setCurrentStep('setting');
          }}
          variant={'ghost'}
          className={`h-12 w-full justify-start text-lg ${currentStep === 'setting' ? 'bg-[#D0EFE0] font-semibold text-[#00592d] hover:bg-[#D0EFE0] hover:text-[#00592d]' : 'font-normal text-neutral-700'}`}
        >
          설정
        </Button>
      </div>
    </div>
  );
}
