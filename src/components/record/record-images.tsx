import { Card } from '../ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function RecordImages({
  images,
  className,
  children,
}: {
  images?: string[];
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center gap-2 font-medium">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.2857 14.2858C15.2325 14.2858 16 13.5182 16 12.5715V3.42864C16 2.48186 15.2325 1.71436 14.2857 1.71436H1.71429C0.767512 1.71436 0 2.48186 0 3.42864V12.5715C0 13.5182 0.767512 14.2858 1.71429 14.2858H14.2857Z"
            fill="#9AD9BA"
          />
          <path
            d="M10.8593 7.35306C11.7852 7.35306 12.5358 6.60246 12.5358 5.67653C12.5358 4.75061 11.7852 4 10.8593 4C9.93336 4 9.18274 4.75061 9.18274 5.67653C9.18274 6.60246 9.93336 7.35306 10.8593 7.35306Z"
            fill="#298C5B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.71429 14.2856H9.80889C9.45402 12.3955 8.43913 10.693 6.94531 9.48176C5.4515 8.27055 3.57593 7.6295 1.65327 7.67297C1.09855 7.67149 0.544967 7.72316 0.000103359 7.82727L0 12.5714C0 13.5179 0.767911 14.2852 1.71429 14.2856C1.71457 14.2856 1.714 14.2856 1.71429 14.2856Z"
            fill="#298C5B"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.83948 10.5896C10.5117 11.6255 10.9816 12.79 11.213 14.0223C11.2294 14.11 11.2375 14.1982 11.2375 14.286H14.2858C15.2302 14.286 15.9963 13.5222 16 12.5786V10.6165C15 10.2788 13.9516 10.1069 12.8962 10.1074C11.8563 10.1052 10.8246 10.2685 9.83948 10.5896Z"
            fill="#298C5B"
          />
        </svg>
        오늘의 사진
      </div>
      {children ? (
        <>{children}</>
      ) : (
        <div className="grid w-full grid-cols-3 gap-2">
          {images?.map((image, index) => (
            <Card className="p-0 shadow-none" key={index}>
              <div className={cn('relative h-40 w-full', className)}>
                <Image
                  src={image}
                  alt={`record-image-${index + 1}`}
                  fill
                  className="rounded-xl object-cover"
                  sizes="(min-width: 1024px) 20vw, 100vw"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
