import NosotrosContent from './NosotrosContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description:
    'Conoce nuestra misión de democratizar el acceso a la información financiera en Venezuela.',
  alternates: {
    canonical: 'https://vtrading.app/nosotros',
  },
  openGraph: {
    title: 'Sobre Nosotros | VTrading',
    description: 'Transparencia, velocidad y precisión. Conoce al equipo detrás de VTrading.',
    url: 'https://vtrading.app/nosotros',
  },
};

export default function NosotrosPage() {
  return <NosotrosContent />;
}
