import EstadoContent from './EstadoContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Estado del Sistema',
  description:
    'Monitoreo en tiempo real de la integridad y disponibilidad de los servicios de VTrading.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EstadoPage() {
  return <EstadoContent />;
}
