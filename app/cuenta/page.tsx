import CuentaContent from './CuentaContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestión de cuenta de usuario VTrading.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CuentaPage() {
  return <CuentaContent />;
}
