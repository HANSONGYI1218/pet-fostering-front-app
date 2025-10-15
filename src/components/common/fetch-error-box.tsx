import { Card } from '../ui/card';

export default function FetchErrorBox({
  errorMessage,
}: {
  errorMessage: string | null;
}) {
  return (
    <Card className="flex h-96 w-full items-center justify-center text-neutral-500">
      {errorMessage ?? '정보를 불러오지 못했습니다.'}
      <span>다시 한번 새로고침 해주세요.</span>
    </Card>
  );
}
