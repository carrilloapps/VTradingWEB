import PrivacidadContent from './PrivacidadContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo VTrading protege tus datos personales. Información sobre recopilación, uso y seguridad de tu información.',
  alternates: {
    canonical: 'https://vtrading.app/privacidad',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacidadPage() {
  return <PrivacidadContent />;
}
