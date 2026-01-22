import AuthActionContent from './AuthActionContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Autenticación',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthActionPage() {
  return <AuthActionContent />;
}
