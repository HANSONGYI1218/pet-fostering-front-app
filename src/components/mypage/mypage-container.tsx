'use client';

import { useState } from 'react';
import MypageMeue from './mypage-menu';
import ProfileTab from './profile-tab';
import FosterTab from './foster-tab';
import RecordTab from './record-tab';
import SettingTab from './setting-tab';

export default function MypageContainer() {
  const [currentStep, setCurrentStep] = useState<string>('profile');

  return (
    <div className="flex w-full gap-10">
      <MypageMeue currentStep={currentStep} setCurrentStep={setCurrentStep} />
      <div className="flex w-full flex-1">
        {currentStep === 'profile' && <ProfileTab />}
        {currentStep === 'foster' && <FosterTab />}
        {currentStep === 'record' && <RecordTab />}
        {currentStep === 'setting' && <SettingTab />}
      </div>
    </div>
  );
}
