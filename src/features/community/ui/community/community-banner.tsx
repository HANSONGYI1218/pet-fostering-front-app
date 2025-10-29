import Image from 'next/image';

export default function CommunityBanner() {
  return (
    <div className="flex min-h-96 w-full flex-col bg-amber-200">
      <div className="relative mx-auto my-auto flex w-full max-w-screen-xl items-center px-6">
        <div className="flex w-full flex-col gap-10">
          <h1 className="text-2xl font-extrabold sm:text-4xl">
            퍼디즈의 이야기 놀이터에
            <br className="lg:hidden" /> 오신걸 환영합니다
          </h1>
          <div className="flex flex-col gap-1 lg:text-lg">
            <span>
              퍼디즈의 이야기 놀이터에서는 <br className="sm:hidden" />
              &apos;임시보호&apos;에 관한 이야기만 나눠주세요!
            </span>
            <span>
              누구나 자유롭게 정보를 공유하고 <br className="sm:hidden" />
              소통왕이 되어보세요
            </span>
            <span>
              따뜻하고 배려있는 말로 모두 함께 <br className="sm:hidden" />
              이야기 놀이터를 가꿔나가요
            </span>
          </div>
        </div>
        <Image
          src="/icons/community-dog.svg"
          width={264}
          height={304}
          alt="dog"
          className="max-md:h-44 max-md:w-40 max-sm:absolute max-sm:right-0 max-sm:-bottom-24 max-sm:w-36"
        />
      </div>
    </div>
  );
}
