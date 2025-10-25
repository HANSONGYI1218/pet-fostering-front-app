import Image from 'next/image';

type ValueType = {
  img: string;
  title: string;
};

const items: ValueType[] = [
  {
    img: '/icons/main/orgranization.svg',
    title: '검증된 기관 연결',
  },
  {
    img: '/icons/main/matching.svg',
    title: '간편한 매칭 과정',
  },
  {
    img: '/icons/main/manage.svg',
    title: '체계적 관리',
  },
];

function ValueTile({ value }: { value: ValueType }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl lg:gap-12">
      <div className="flex items-center justify-center rounded-[40px] bg-white/10 p-8 shadow-2xl">
        <Image
          src={value?.img}
          width={120}
          height={120}
          alt="dog-image"
          className="aspect-square object-cover max-sm:h-[84px] max-sm:w-[84px]"
        />
      </div>
      <h1 className="text-base text-white lg:text-lg">{value?.title}</h1>
    </div>
  );
}

export default function ValueContainer() {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-10 sm:flex-row sm:gap-6 lg:w-1/2">
      {items.map((item: ValueType, index: number) => {
        return <ValueTile key={index} value={item} />;
      })}
    </div>
  );
}
