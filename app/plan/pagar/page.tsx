import { Metadata } from 'next';
import PagarContent from './PagarContent';

export const metadata: Metadata = {
  title: 'Pagar Plan Premium | VTrading',
  description:
    'Completa tu suscripción al Plan Premium de VTrading. Elige tu método de pago preferido y disfruta de todas las funcionalidades sin límites.',
  keywords: ['pagar', 'premium', 'suscripción', 'vtrading', 'checkout', 'pago'],
  openGraph: {
    title: 'Pagar Plan Premium | VTrading',
    description: 'Completa tu suscripción al Plan Premium de VTrading',
    type: 'website',
  },
};

export default function PagarPage() {
  return <PagarContent />;
}
