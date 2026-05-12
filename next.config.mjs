const parseHosts = (rawHosts) =>
  rawHosts
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const hostnames = [
  'storage.googleapis.com',
  'i.*',
  'cdn.*',
  'www.google.com',
  'prd-main-cdn.aboutpet.co.kr',
  'encrypted-tbn0.gstatic.com',
  '*.cloudfront.net',
  'mblogthumb-phinf.pstatic.net',
  'images.*',
];

const buildRemotePatterns = () => {
  const patterns = hostnames.map((hostname) => ({
    protocol: 'https',
    hostname,
    pathname: '/**',
  }));

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
