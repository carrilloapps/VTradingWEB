import React from 'react';
import TerminosContent from './TerminosContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Consulta los términos y condiciones de uso de VTrading. Información legal sobre nuestros servicios, responsabilidades y uso aceptable.',
  alternates: {
    canonical: 'https://vtrading.app/terminos',
  },
};

export default function TerminosPage() {
  return <TerminosContent />;
}
