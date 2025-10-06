'use client';

import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import Image from 'next/image';

const steps = ['시작', 'step01', 'step02', 'step03', '등록'];

export default function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mx-auto w-full py-10">
      {/* Step Indicator */}
      <div className="relative flex items-center justify-between">
        {steps.map((step, idx) => (
          <div key={idx} className="relative flex flex-1 flex-col items-center">
            {/* Circle */}
            {idx === 0 ? (
              <div className={`flex h-fit w-fit rounded-full`}>
                <Image
                  src="/images/paw-with-hand.png"
                  width={40}
                  height={40}
                  className={`${currentStep === 0 ? 'scale-120' : 'scale-100'} `}
                  alt="paw-with-hand.png"
                />
              </div>
            ) : idx === steps.length - 1 ? (
              <div className={`flex h-fit w-fit rounded-full p-1`}>
                <BadgeCheck
                  className={`h-10 w-10 ${currentStep === steps.length - 1 ? 'scale-120 fill-[#D0EFE0] stroke-[#00592d]' : 'scale-100 fill-white stroke-[#e5e7eb]'}`}
                  strokeWidth={2}
                />
              </div>
            ) : (
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: currentStep >= idx ? '#00592d' : '#e5e7eb',
                  scale: currentStep === idx ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="z-10 flex h-10 w-10 items-center justify-center rounded-full font-medium text-white"
              >
                {idx + 1}
              </motion.div>
            )}
            {/* Label */}
            <span
              className={`mt-2 text-sm ${
                currentStep >= idx
                  ? 'font-semibold text-[#00592d]'
                  : 'text-gray-400'
              }`}
            >
              {step}
            </span>

            {/* Connector Line */}
            {idx < steps.length - 1 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: currentStep > idx ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
                className="absolute top-5 left-1/2 h-1 bg-[#00592d]"
                style={{ right: '-50%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
