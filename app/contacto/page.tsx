import ContactoContent from './ContactoContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contáctanos',
  description: 'Ponte en contacto con nuestro equipo de soporte y ventas. Estamos aquí para ayudarte con tus necesidades financieras.',
  alternates: {
    canonical: 'https://vtrading.app/contacto',
  },
  openGraph: {
    title: 'Contáctanos | VTrading',
    description: 'Hablemos de finanzas. Estamos en línea para atenderte.',
    url: 'https://vtrading.app/contacto',
  },
};

export default function ContactoPage() {
  return <ContactoContent />;
}
