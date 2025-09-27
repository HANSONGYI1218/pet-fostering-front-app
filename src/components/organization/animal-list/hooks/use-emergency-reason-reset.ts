import { useEffect } from 'react';
import type { FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

export type EmergencyForm = {
  isEmergency: boolean;
  emergency_reason: string;
};

export const useEmergencyReasonReset = <
  FormValues extends EmergencyForm & FieldValues,
>(
  form: UseFormReturn<FormValues>,
) => {
  const isEmergencyField = 'isEmergency' as FieldPath<FormValues>;
  const emergencyReasonField = 'emergency_reason' as FieldPath<FormValues>;
  const isEmergency = form.watch(isEmergencyField) as FormValues['isEmergency'];

  useEffect(() => {
    if (!isEmergency) {
      form.resetField(emergencyReasonField, {
        keepDirty: false,
        keepTouched: false,
        keepError: false,
      });
    }
  }, [form, emergencyReasonField, isEmergency]);
};
