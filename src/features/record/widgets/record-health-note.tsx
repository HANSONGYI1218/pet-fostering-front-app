import { Card } from '@/shared/ui/card';

export function RecordHealthNote({
  health_note,
  children,
}: {
  health_note?: string;
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
          <g clipPath="url(#clip0_2024_5604)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.916347 0.75C0.44296 0.75 0.0592041 1.13376 0.0592041 1.60714V5.71429C0.0592041 7.95133 1.67869 9.81011 3.80921 10.1822V10.8089C3.80921 13.6167 6.08538 15.8928 8.89318 15.8928C11.701 15.8928 13.9772 13.6167 13.9772 10.8089V7.25C13.9772 6.77662 13.5934 6.39286 13.1201 6.39286C12.6467 6.39286 12.2629 6.77662 12.2629 7.25V10.8089C12.2629 12.6699 10.7542 14.1785 8.89318 14.1785C7.03216 14.1785 5.52349 12.6699 5.52349 10.8089V10.1549C7.58313 9.72638 9.13064 7.90105 9.13064 5.71429V1.60714C9.13064 1.13376 8.74688 0.75 8.27349 0.75H7.02349C6.5501 0.75 6.16635 1.13376 6.16635 1.60714C6.16635 2.08053 6.5501 2.46429 7.02349 2.46429H7.41635V5.71429C7.41635 7.27251 6.15315 8.53571 4.59492 8.53571C3.03668 8.53571 1.77349 7.27251 1.77349 5.71429V2.46429H2.16635C2.63973 2.46429 3.02349 2.08053 3.02349 1.60714C3.02349 1.13376 2.63973 0.75 2.16635 0.75H0.916347Z"
              fill="#9AD9BA"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.7499 2.26621C12.2191 1.9157 10.6941 2.87245 10.3436 4.40315C9.99309 5.93386 10.9498 7.45889 12.4805 7.80939C14.0112 8.15991 15.5363 7.20317 15.8868 5.67246C16.2373 4.14175 15.2806 2.61672 13.7499 2.26621Z"
              fill="#298C5B"
            />
          </g>
          <defs>
            <clipPath id="clip0_2024_5604">
              <rect width="16" height="16" fill="white" />
            </clipPath>
          </defs>
        </svg>
        건강 상태
      </div>
      {children ? (
        <>{children}</>
      ) : (
        <Card className="min-h-32 cursor-default p-3 shadow-none">
          {health_note}
        </Card>
      )}
    </div>
  );
}
