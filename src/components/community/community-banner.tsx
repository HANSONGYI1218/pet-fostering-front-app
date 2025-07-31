import Image from 'next/image';

export default function CommunityBanner() {
  return (
    <div className="flex w-full flex-col bg-amber-200 pt-20">
      <div className="mx-auto flex w-full max-w-[1280px]">
        <div className="flex w-full flex-col gap-10">
          <h1 className="text-[44px] font-extrabold">
            퍼디의 이야기 놀이터에 오신걸 환영합니다
          </h1>
          <div className="flex flex-col gap-1 text-lg">
            <span>
              퍼디의 이야기 놀이터에서는 '임시보호'에 관한 이야기만 나눠주세요!
            </span>
            <span>누구나 자유롭게 정보를 공유하고 소통왕이 되어보세요</span>
            <span>
              따뜻하고 배려있는 말로 모두 함께 이야기 놀이터를 가꿔나가요
            </span>
          </div>
        </div>
        <Image
          src="/icons/community-dog.svg"
          width={264}
          height={304}
          alt="dog"
        />
      </div>
    </div>
  );
}
