type Option<T> = {
  key: T;
  word: string;
};

export default function SelectedButton<T extends string | number>({
  first,
  second,
  third,
  value,
  onChange,
}: {
  first: Option<T>;
  second?: Option<T>;
  third: Option<T>;
  value: T;
  onChange: (value: T | undefined) => void;
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
      {second && (
        <>
          <div className="flex h-full w-[1px] border" />
          <div
            onClick={() => {
              onChange(second?.key);
            }}
            className={`flex w-full cursor-pointer items-center justify-center text-center ${value === second?.key ? 'bg-[#00592d] font-semibold text-white hover:bg-[#00592d]/80' : 'hover:bg-green-10'}`}
          >
            {second?.word}
          </div>
        </>
      )}
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
