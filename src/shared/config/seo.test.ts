import { beforeEach, describe, expect, it } from 'vitest';

import { createAppMetadata } from './seo';

const SITE_URL = 'https://perdiz.pet';

describe('createAppMetadata', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = SITE_URL;
  });

  it('기본 메타데이터와 오픈그래프 정보를 반환한다', () => {
    const metadata = createAppMetadata();

    expect(metadata.title).toBe('임시보호 매칭 플랫폼 퍼디즈');
    expect(metadata.description).toBe(
      '임시보호자와 보호소를 빠르게 연결하는 퍼디즈 플랫폼입니다.',
    );
    expect(metadata.metadataBase?.href).toBe(`${SITE_URL}/`);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/`);

    expect(metadata.openGraph?.type).toBe('website');
    expect(metadata.openGraph?.locale).toBe('ko_KR');
    expect(metadata.openGraph?.url?.toString()).toBe(`${SITE_URL}/`);
    expect(metadata.openGraph?.images?.[0]).toMatchObject({
      url: '/og',
      width: 1200,
      height: 630,
      alt: '임시보호 매칭 플랫폼 퍼디즈',
    });

    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: '임시보호 매칭 플랫폼 퍼디즈',
      description: '임시보호자와 보호소를 빠르게 연결하는 퍼디즈 플랫폼입니다.',
      images: ['/og'],
    });
  });

  it('옵션으로 제목과 설명을 덮어쓰고 경로를 설정한다', () => {
    const metadata = createAppMetadata({
      title: '새로운 제목',
      description: '새로운 설명',
      path: '/foster-list/123',
    });

    expect(metadata.title).toBe('새로운 제목');
    expect(metadata.description).toBe('새로운 설명');
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/foster-list/123`);
    expect(metadata.openGraph?.url?.toString()).toBe(
      `${SITE_URL}/foster-list/123`,
    );
    expect(metadata.openGraph?.title).toBe('새로운 제목');
    expect(metadata.twitter?.title).toBe('새로운 제목');
    expect(metadata.twitter?.description).toBe('새로운 설명');
  });

  it('커스텀 OG 이미지를 지정할 수 있다', () => {
    const metadata = createAppMetadata({
      image: {
        url: '/images/custom.png',
        alt: '커스텀 이미지',
        width: 800,
        height: 400,
      },
    });

    expect(metadata.openGraph?.images?.[0]).toMatchObject({
      url: '/images/custom.png',
      alt: '커스텀 이미지',
      width: 800,
      height: 400,
    });
    expect(metadata.twitter?.images).toEqual(['/images/custom.png']);
  });
});
