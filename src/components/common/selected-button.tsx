export default function SelectedButton({
  first,
  second,
  third,
  value,
  onChange,
}: {
  first: { key: any; word: string };
  second?: { key: any; word: string };
  third: { key: any; word: string };
  value: string;
  onChange: any;
}) {
  return (
    <div className="flex h-10 rounded-xl border">
      <div
        onClick={() => {
          onChange(first?.key);
        }}
        className={`flex w-full cursor-pointer items-center justify-center rounded-l-xl ${value === first?.key ? 'bg-[#00592d] font-semibold text-white hover:bg-[#00592d]/80' : 'hover:bg-green-10'}`}
      >
        {first?.word}
      </div>
      {second && <div className="flex h-full w-[1px] border" />}
      <div
        onClick={() => {
          onChange(second?.key);
        }}
        className={`w-full cursor-pointer items-center justify-center ${value === second?.key ? 'bg-[#00592d] font-semibold text-white hover:bg-[#00592d]/80' : 'hover:bg-green-10'} ${second ? 'flex' : 'hidden'}`}
      >
        {second?.word}
      </div>
      <div className="flex h-full w-[1px] border" />
      <div
        onClick={() => {
          onChange(third?.key);
        }}
        className={`flex w-full cursor-pointer items-center justify-center rounded-r-xl ${value === third?.key ? 'bg-[#00592d] font-semibold text-white hover:bg-[#00592d]/80' : 'hover:bg-green-10'}`}
      >
        {third?.word}
      </div>
    </div>
  );
}
