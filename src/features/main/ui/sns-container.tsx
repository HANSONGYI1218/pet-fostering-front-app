import Image from 'next/image';

type SnsItem = {
  img: string;
  title: string;
  description: string;
};

const SNS_ITEMS: SnsItem[] = [
  {
    img: '/icons/main/instagram.svg',
    title: 'SNS',
    description: `퍼디즈 소식을 빠르게 확인하세요`,
  },
  {
    img: '/icons/main/community.svg',
    title: '퍼디즈 커뮤니티',
    description: '임보자들과 소통해보세요',
  },
  {
    img: '/icons/main/faq.svg',
    title: 'FAQ',
    description: '자주 묻는 질문을 알려드립니다',
  },
  {
    img: '/icons/main/comment.svg',
    title: '바라는 점',
    description: '개선할 점을 알려주세요',
  },
];

function SnsTile({ value }: { value: SnsItem }) {
  return (
    <div className="mx-auto flex aspect-square h-full w-full max-w-[268px] flex-col items-center justify-center gap-6 rounded-xl border bg-white p-6 shadow-md">
      <Image
        src={value.img}
        width={72}
        height={72}
        alt={value.title}
        className="aspect-square object-cover max-lg:h-[54px] max-lg:w-[54px]"
      />
      <h3 className="text-lg font-semibold text-neutral-800 lg:text-xl">
        {value.title}
      </h3>
      <p className="text-center text-base break-keep text-neutral-800 lg:text-lg">
        {value.description}
      </p>
    </div>
  );
}

export default function SnsContainer() {
  return (
    <div className="relative flex w-full px-16 py-10">
      <svg
        width="95"
        height="175"
        viewBox="0 0 95 175"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 right-0 z-0"
      >
        <circle cx="84.5" cy="13.5" r="84.5" fill="#FA8988" />
        <circle cx="28.5" cy="159.5" r="15.5" fill="#FDAAAA" />
      </svg>
      <div className="relative z-10 mx-auto grid w-full max-w-xl grid-cols-1 gap-10 sm:grid-cols-2">
        {SNS_ITEMS.map((item) => {
          return <SnsTile key={item.title} value={item} />;
        })}
      </div>
    </div>
  );
}
