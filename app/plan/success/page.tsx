import { Metadata } from 'next';
import { Suspense } from 'react';
import SuccessContent from './SuccessContent';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'Pago Exitoso | VTrading',
  description: 'Tu suscripción a VTrading Premium ha sido procesada exitosamente.',
  robots: 'noindex, nofollow',
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
