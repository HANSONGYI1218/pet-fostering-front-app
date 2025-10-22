import Image from 'next/image';

type SnsType = {
  img: string;
  title: string;
  discription: string;
};

const items: SnsType[] = [
  {
    img: '/icons/main/instagram.svg',
    title: 'SNS',
    discription: '퍼디 소식을 빠르게 확인하세요',
  },
  {
    img: '/icons/main/community.svg',
    title: '퍼디 커뮤니티',
    discription: '임보자들과 소통해보세요',
  },
  {
    img: '/icons/main/faq.svg',
    title: 'FAQ',
    discription: '자주 묻는 질문을 알려드립니다',
  },
  {
    img: '/icons/main/comment.svg',
    title: '바라는 점',
    discription: '개선할 점을 알려주세요',
  },
];

function SnsTile({ value }: { value: SnsType }) {
  return (
    <div className="mx-auto flex h-72 w-72 flex-col items-center justify-center gap-6 rounded-xl border shadow-md">
      <Image
        src={value?.img}
        width={72}
        height={72}
        alt="dog-image"
        className="aspect-square object-cover"
      />
      <h1 className="text-xl font-semibold text-neutral-800">{value?.title}</h1>
      <span className="text-lg text-neutral-800">{value?.discription}</span>
    </div>
  );
}

export default function SnsContainer() {
  return (
    <div className="relative grid w-full grid-cols-2 items-center gap-6 px-28 py-10">
      <svg
        width="95"
        height="175"
        viewBox="0 0 95 175"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 right-0"
      >
        <circle cx="84.5" cy="13.5" r="84.5" fill="#FA8988" />
        <circle cx="28.5" cy="159.5" r="15.5" fill="#FDAAAA" />
      </svg>

      {items.map((item: SnsType, index: number) => {
        return <SnsTile key={index} value={item} />;
      })}
    </div>
  );
}
