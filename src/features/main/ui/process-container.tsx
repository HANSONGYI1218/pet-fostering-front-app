/* eslint-disable @next/next/no-img-element */

type ProcessType = {
  img: string;
  title: string;
};

const items: ProcessType[] = [
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

function PorcessTile({ value }: { value: ProcessType }) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-xl">
      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-white shadow-lg">
        <img
          src={value?.img}
          alt="dog-image"
          className="h-auto w-auto object-contain"
        />
      </div>
      <h1 className="text-lg text-neutral-800">{value?.title}</h1>
    </div>
  );
}

export default function PorcessContainer() {
  return (
    <div className="flex w-full items-center justify-center">
      {items.map((item: ProcessType, index: number) => {
        return (
          <div key={index} className="flex w-fit items-center">
            <PorcessTile value={item} />
            {index !== items?.length - 1 && (
              <svg
                width="19"
                height="33"
                viewBox="0 0 19 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-14"
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
