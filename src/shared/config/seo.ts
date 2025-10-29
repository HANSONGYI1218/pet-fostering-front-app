import type { Metadata } from 'next';

const FALLBACK_SITE_URL = 'https://perdiz.pet';

const TITLE = '임시보호 매칭 플랫폼 퍼디즈';
const DESCRIPTION = '임시보호자와 보호소를 빠르게 연결하는 퍼디즈 플랫폼입니다.';
const OG_IMAGE_PATH = '/og';

type MetadataImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type AppMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: MetadataImage;
};

const resolveSiteUrl = (): URL => {
  const target = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;

  try {
    return new URL(target);
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
};

const resolvePageUrl = (siteUrl: URL, path?: string) => {
  if (!path) {
    return siteUrl.toString();
  }

  try {
    return new URL(path, siteUrl).toString();
  } catch {
    return siteUrl.toString();
  }
};

export const createAppMetadata = (
  options: AppMetadataOptions = {},
): Metadata => {
  const siteUrl = resolveSiteUrl();
  const title = options.title ?? TITLE;
  const description = options.description ?? DESCRIPTION;
  const pageUrl = resolvePageUrl(siteUrl, options.path);
  const image = options.image ?? {
    url: OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: TITLE,
  };

  return {
    metadataBase: siteUrl,
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      url: pageUrl,
      title,
      description,
      images: [
        {
          url: image.url,
          width: image.width ?? 1200,
          height: image.height ?? 630,
          alt: image.alt ?? title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image.url],
    },
  };
};

export type AppMetadata = ReturnType<typeof createAppMetadata>;
