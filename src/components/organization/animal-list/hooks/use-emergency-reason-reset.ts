import { useEffect } from 'react';
import type { UseFormReturn } from 'react-hook-form';

type EmergencyForm = {
  isEmergency: boolean;
  emergency_reason: string;
};

export const useEmergencyReasonReset = (form: UseFormReturn<EmergencyForm>) => {
  const isEmergency = form.watch('isEmergency');

  useEffect(() => {
    if (!isEmergency) {
      form.setValue('emergency_reason', '', {
        shouldDirty: false,
        shouldTouch: false,
      });
    }
  }, [form, isEmergency]);
};
