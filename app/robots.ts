import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://vtrading.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/cuenta/',
        '/auth/',
        '/terminos',
        '/privacidad',
        '/cookies',
        '/licencias',
        '/estado',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
