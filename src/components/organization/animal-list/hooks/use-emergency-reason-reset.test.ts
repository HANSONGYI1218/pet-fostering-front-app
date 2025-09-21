import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useForm } from 'react-hook-form';

import { useEmergencyReasonReset } from './use-emergency-reason-reset';

describe('useEmergencyReasonReset', () => {
  const setup = () =>
    renderHook(() => {
      const form = useForm({
        defaultValues: {
          isEmergency: false,
          emergency_reason: '',
        },
      });

      useEmergencyReasonReset(form);

      return form;
    });

  it('긴급 여부를 true로 변경해도 기존 사유를 유지한다', () => {
    const { result } = setup();

    act(() => {
      result.current.setValue('emergency_reason', '안락사 예정');
    });

    act(() => {
      result.current.setValue('isEmergency', true);
    });

    expect(result.current.getValues('emergency_reason')).toBe('안락사 예정');
  });

  it('긴급 여부를 false로 바꾸면 사유를 초기화한다', () => {
    const { result } = setup();

    act(() => {
      result.current.setValue('emergency_reason', '위험 노출');
      result.current.setValue('isEmergency', true);
    });

    act(() => {
      result.current.setValue('isEmergency', false);
    });

    expect(result.current.getValues('emergency_reason')).toBe('');
  });
});
