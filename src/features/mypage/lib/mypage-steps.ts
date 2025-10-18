export const MYPAGE_STEPS = ['profile', 'foster', 'record', 'setting'] as const;

export type MypageStep = (typeof MYPAGE_STEPS)[number];

export const MYPAGE_STEP_LABEL: Record<MypageStep, string> = {
  profile: '프로필',
  foster: '임시보호자',
  record: '활동 기록',
  setting: '설정',
};

export const isMypageStep = (value: string | null): value is MypageStep => {
  if (!value) {
    return false;
  }

  return MYPAGE_STEPS.some((step) => step === value);
};
