import CookiesContent from './CookiesContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description:
    'Información sobre el uso de cookies y tecnologías de almacenamiento local en VTrading para mejorar tu experiencia.',
  alternates: {
    canonical: 'https://vtrading.app/cookies',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CookiesPage() {
  return <CookiesContent />;
}
