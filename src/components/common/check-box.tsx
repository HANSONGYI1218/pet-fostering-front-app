'use client';

import type { CheckedState } from '@radix-ui/react-checkbox';

import { Checkbox } from '../ui/checkbox';

export default function CheckBox({
  label,
  value,
  selectedValue,
  onChangeValue,
}: {
  label: string;
  value: string;
  selectedValue: string;
  onChangeValue: (state: string) => void;
}) {
  const isChecked = selectedValue === value;

  const handleChange = (checked: CheckedState) => {
    if (!checked || isChecked) return;

    onChangeValue(value);
  };

  return (
    <div className="flex items-center space-x-2 rounded-2xl border p-3">
      <Checkbox
        id={label}
        checked={isChecked}
        onCheckedChange={handleChange}
        className="h-4 w-4 rounded-full"
      />
      <label
        htmlFor={label}
        className="flex-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
