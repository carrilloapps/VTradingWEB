'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ColorModeProvider } from '@/context/ThemeContext';

export default function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ColorModeProvider>
        <CssBaseline />
        {children}
      </ColorModeProvider>
    </AppRouterCacheProvider>
  );
}
