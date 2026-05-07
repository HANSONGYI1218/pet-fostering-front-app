import Image from 'next/image';

type ProcessItem = {
  img: string;
  title: string;
};

const PROCESS_ITEMS: ProcessItem[] = [
  {
    img: '/icons/main/process-01.svg',
    title: '임보자 프로필 등록하기',
  },
  {
    img: '/icons/main/process-02.svg',
    title: '임시보호 동물 정보 확인',
  },
  {
    img: '/icons/main/process-03.svg',
    title: '임보 요청하기 클릭',
  },
  {
    img: '/icons/main/process-04.svg',
    title: '임보자 정보 확인후 기관 매칭',
  },
];

function ProcessTile({ value }: { value: ProcessItem }) {
  return (
    <div className="flex w-full max-w-[146px] flex-col items-center gap-6 rounded-xl">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg lg:h-40 lg:w-40">
        <Image
          width={160}
          height={160}
          src={value.img}
          alt={value.title}
          className="object-contain lg:h-auto lg:w-auto"
        />
      </div>
      <h1 className="text-center text-base break-keep text-neutral-800 lg:text-lg">
        {value.title}
      </h1>
    </div>
  );
}

export default function ProcessContainer() {
  return (
    <div className="mx-auto flex w-full max-w-screen-lg flex-col flex-wrap gap-y-4 sm:flex-row sm:gap-y-6">
      {PROCESS_ITEMS.map((item, index) => {
        const isLast = index === PROCESS_ITEMS.length - 1;

        return (
          <div
            key={item.title}
            className="mx-auto flex w-fit flex-col items-center max-sm:gap-6 sm:flex-row md:text-xl"
          >
            <ProcessTile value={item} />
            {!isLast && (
              <svg
                width="19"
                height="33"
                viewBox="0 0 19 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-4 h-[33px] w-[33px] max-sm:rotate-90 xl:mx-14"
              >
                <path
                  d="M18.75 16.0215L3.98367e-07 32.043L1.79901e-06 1.44392e-05L18.75 16.0215Z"
                  fill="#FA8988"
                />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
