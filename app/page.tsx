import HomeContent from './HomeContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VTrading - El monitor financiero que Venezuela necesitaba',
  description: 'Accede a datos de mercado en tiempo real, gráficos interactivos y herramientas de análisis técnico para criptomonedas, forex y acciones.',
  alternates: {
    canonical: 'https://vtrading.app',
  },
};

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'VTrading',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Plataforma avanzada de análisis y gestión de trading.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
    },
    author: {
      '@type': 'Organization',
      name: 'VTrading',
      url: 'https://vtrading.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent />
    </>
  );
}
