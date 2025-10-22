import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import { AnimalListItem } from '@/entities/animal/animal-api';
import { fetchAnimalLists } from '@/features/main/api/animal';
import { logError } from '@/shared/lib/logging';
import AnimalTile from '@/features/main/ui/animal-tile';
import { dummyAnimals } from '@/features/main/api/dummy';
import ValueContainer from '@/features/main/ui/value-container';
import PorcessContainer from '@/features/main/ui/process-container';
import SnsContainer from '@/features/main/ui/sns-container';

const DEFAULT_ANIMAL_LIMIT = 10;

export default async function Home() {
  let animals: AnimalListItem[] = [];

  try {
    animals = await fetchAnimalLists({ limit: DEFAULT_ANIMAL_LIMIT });
  } catch {
    // logError('커뮤니티 게시글 불러오기 실패', error);
    animals = dummyAnimals;
  }

  return (
    <main className="flex w-full flex-col">
      <section
        style={{
          backgroundImage: `url('/images/main/main-banner-test.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="relative flex h-[645px] w-full flex-col justify-center"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 80% 60%, rgba(0,0,0,0) 340px, rgba(0,0,0,0.5) 600px)`,
          }}
        />

        <div className="relative z-10 mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-9">
          <span className="text-[54px] font-black text-[#00592d]">퍼디즈</span>
          <h1
            style={{ fontFamily: "'Nanum Pen Script', cursive" }}
            className="flex flex-col text-[92px] leading-28 font-[500] text-white"
          >
            사람과 동물이
            <br />
            따뜻하게 연결되는 곳
          </h1>
          <hr className="w-1/3 border-white" />
          <span className="text-3xl text-white">
            퍼디와 함께 아이들의 희망이 되어주세요
          </span>
        </div>
      </section>
      <section className="relative flex h-[645px] w-full flex-col justify-center">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-12">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold text-neutral-800">
              보이지 않는 마음을 잇는 손,
            </h1>
            <span className="text-5xl font-[800] text-[#00592d]">FURDIZ</span>
          </div>
          <span className="text-xl">
            퍼디는 ‘임시보호’를 넘어,
            <br />
            마음과 마음이 이어지는 따뜻한 보호의 고리를 만듭니다.
          </span>
          <Link href="/foster-list">
            <Button
              variant={'destructive'}
              className="h-12 w-64 rounded-full border-[#15894B] bg-[#15894B]"
            >
              임보 신청하기 <MoveRight />
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 flex h-full w-[580px] overflow-hidden rounded-l-full">
          <div className="absolute bottom-20 left-0 z-10 h-64 w-24 -rotate-[25deg] rounded-r-full bg-white/50 blur-xs" />
          <Image
            src="/images/main/dog-tug.png"
            width={640}
            height={640}
            alt="tug-play"
            unoptimized
            style={{
              width: '640px',
              height: '640px',
              objectFit: 'cover',
              objectPosition: 'right', // ✅ 오른쪽 끝 기준
            }}
          />
        </div>
      </section>
      <section className="relative flex h-[645px] w-full flex-col justify-center bg-[#F2F2F2]">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-12">
          <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-start gap-12">
            <h1 className="text-4xl font-bold text-neutral-800">
              당신의 손길이 필요한 아이들
            </h1>
            <span className="text-xl">
              사랑이 필요한 아이들을 만나보세요.
              <br />
              작지만 따뜻한 결정이, 한 생명을 구합니다.
            </span>
            <Link href="/foster-list">
              <Button
                variant={'destructive'}
                className="h-12 w-64 rounded-full border-[#15894B] bg-[#15894B]"
              >
                보호동물 더보기 <MoveRight />
              </Button>
            </Link>
          </div>
        </div>
        <div className="custom-scrollbar absolute top-1/2 right-0 flex w-full max-w-screen-lg -translate-y-1/2 gap-6 overflow-x-auto rounded-xl pb-6">
          {animals?.map((animal) => {
            return <AnimalTile key={animal?.id} animal={animal} />;
          })}
        </div>
      </section>
      <section className="relative flex h-[445px] w-full flex-col justify-center bg-[#00592d]">
        <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between">
          <div className="flex flex-col gap-12">
            <h1 className="text-5xl font-[800] text-[#FA8988]">
              FURDIZ’S VALUE
            </h1>
            <span className="text-xl">
              좋은 마음이 이어지도록,
              <br />
              퍼디가 임시보호를 쉽고 따뜻하게 만듭니다.
            </span>
          </div>
          <ValueContainer />
        </div>
      </section>
      <section className="box-shadow-md relative flex h-[645px] w-full flex-col justify-center bg-[#FFFBFB] shadow-[inset_0_-3px_4px_rgba(0,0,0,0.1)]">
        <div className="mx-auto flex w-full max-w-screen-2xl flex-col items-center justify-between gap-32">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl font-bold text-neutral-800">
              임시보호는 어떻게 이루어지나요?
            </h1>
            <span className="text-lg text-neutral-600">
              더 자세한 내용은 퍼디 임보 절차 페이지를 참조하세요.
            </span>
          </div>
          <PorcessContainer />
        </div>
      </section>
      <section className="relative flex w-full justify-center">
        <div className="relative flex w-full flex-col gap-12 bg-[#FFEFF2] p-20 brightness-95">
          <div className="flex w-full gap-3 text-4xl font-bold">
            <h1 className="text-[#FF5F4D]">CONNECT WITH</h1>
            <h1 className="text-neutral-800">FURDDY</h1>
          </div>
          <span className="text-2xl leading-9 font-[500] text-neutral-800">
            작지만 소중한 연결의 이야기.
            <br />
            퍼디가 만들어온 따뜻한 순간들을 기록합니다.
          </span>
          <svg
            width="254"
            height="336"
            viewBox="0 0 254 336"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute bottom-0 left-0"
          >
            <circle cx="234.5" cy="150.5" r="19.5" fill="#FA8988" />
            <circle cx="31.5" cy="309.5" r="203.5" fill="#F06760" />
            <circle cx="200.5" cy="43.5" r="43.5" fill="#FF837D" />
          </svg>
          <Image
            src="/images/main/2-dog.png"
            alt="/2-dog"
            width={402}
            height={535}
            className="absolute right-0 bottom-0"
          />
        </div>
        <SnsContainer />
      </section>
    </main>
  );
}
