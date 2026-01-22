import LicenciasContent from './LicenciasContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Licencias y Planes',
  description: 'Información sobre licenciamiento y planes de acceso a datos de VTrading.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LicenciasPage() {
  return <LicenciasContent />;
}
