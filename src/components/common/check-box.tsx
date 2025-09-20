'use client';

import { Checkbox } from '../ui/checkbox';

export default function CheckBox({
  label,
  id,
  value,
  onChangeValue,
}: {
  label: string;
  id: string;
  value: string;
  onChangeValue: (state: string) => void;
}) {
  const isChecked = value === label;

  const handleChange = () => {
    if (!isChecked) {
      // 체크박스를 클릭했을 때 value를 label로 설정하여 부모 상태를 업데이트
      onChangeValue(label);
    }
  };

  return (
    <div className="flex items-center space-x-2 rounded-2xl border p-3">
      <Checkbox
        id={id}
        checked={isChecked}
        onClick={handleChange}
        className="h-4 w-4 rounded-full"
      />
      <label
        htmlFor={id}
        className="flex-1 text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </label>
    </div>
  );
}
