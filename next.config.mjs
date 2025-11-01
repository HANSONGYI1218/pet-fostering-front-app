const parseHosts = (rawHosts) =>
  rawHosts
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const buildRemotePatterns = () => {
  const patterns = [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '*.s3.ap-northeast-2.amazonaws.com',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: '*.cloudfront.net',
      pathname: '/**',
    },
  ];

  const additionalHosts = parseHosts(process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? '');

  for (const host of additionalHosts) {
    try {
      const value = host.startsWith('http') ? host : `https://${host}`;
      const url = new URL(value);
      patterns.push({
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        pathname: '/**',
      });
    } catch {
      // ignore invalid host entries
    }
  }

  return patterns;
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: buildRemotePatterns(),
  },
};

export default nextConfig;
