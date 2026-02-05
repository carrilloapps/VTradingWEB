import { Metadata } from 'next';
import SuccessContent from './SuccessContent';

export const metadata: Metadata = {
  title: 'Pago Exitoso | VTrading',
  description: 'Tu suscripción a VTrading Premium ha sido procesada exitosamente.',
  robots: 'noindex, nofollow',
};

export default function SuccessPage() {
  return <SuccessContent />;
}
