import { Suspense } from 'react';
import CuentaContent from './CuentaContent';
import type { Metadata } from 'next';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Gestión de cuenta de usuario VTrading.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CuentaPage() {
  return (
    <Suspense 
      fallback={
        <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center">
          <CircularProgress size={40} thickness={4} />
        </Box>
      }
    >
      <CuentaContent />
    </Suspense>
  );
}
