import PlanContent from './PlanContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Planes y Precios',
  description: 'Elige el plan perfecto para ti. Accede a información financiera de calidad con VTrading Free o Premium.',
  alternates: {
    canonical: 'https://vtrading.app/plan',
  },
  openGraph: {
    title: 'Planes y Precios | VTrading',
    description: 'Compara nuestros planes Free y Premium. Información financiera al alcance de todos.',
    url: 'https://vtrading.app/plan',
  },
};

export default function PlanPage() {
  return <PlanContent />;
}
