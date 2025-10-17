import { useEffect } from 'react';
import type {
  FieldPath,
  FieldPathValue,
  FieldValues,
  UseFormReturn,
} from 'react-hook-form';

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
      const resetValue = '' as FieldPathValue<
        FormValues,
        typeof emergencyReasonField
      >;
      form.setValue(emergencyReasonField, resetValue, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    }
  }, [form, emergencyReasonField, isEmergency]);
};
