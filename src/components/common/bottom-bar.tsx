'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomBar() {
  const path = usePathname();

  // 해당 조건에 맞지 않으면 null 반환
  return (
    <>
      <footer className={`h-[168px] border-t-2`}>
        <section className="mx-auto my-auto flex h-full max-w-6xl justify-between px-4 py-5 text-xs">
          <div className="tracking-wide">
            <p className="pb-3 font-bold">로지아이텍컴퍼니</p>
            <p>이사장: 한송이 (로지아이텍컴퍼니)</p>
            {/* <p>사업자등록번호: 324-82-00580 | 이사장: 염민호 (스팩스페이스)</p> */}
            {/* <p>통신판매업 신고번호: 2022-경기김포-3659</p> */}
            <p>주소: 중랑구 상봉동 104-37</p>
            <p>연락처: 019-4054-9873</p>
            {/* <p>FAX: 02-6217-1115</p> */}
            <p>고객센터: hhan121811@gmail.com</p>
          </div>
          <div className="mobile:items-end mobile:pt-0 flex flex-col items-center gap-5 pt-4">
            <div className="flex flex-row">
              <p>개인정보 처리방침</p>
              <p className="mx-2">|</p>
              <p>서비스 이용약관</p>

              <p className="mx-2">|</p>
              <p>환불규정</p>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
}
