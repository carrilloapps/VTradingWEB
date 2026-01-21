'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createTheme, ThemeProvider, useMediaQuery, PaletteColor, PaletteColorOptions } from '@mui/material';

// --- Tipado extendido para MUI ---
declare module '@mui/material/styles' {
  interface Palette {
    trendUp: string;
    trendDown: string;
    skeleton: string;
    skeletonHighlight: string;
    successContainer: string;
    infoContainer: string;
    neutral: string;
    neutralContainer: string;
    danger: string;
    buttonBorder: string;
    exchangeCardBorder: string;
    tertiary: PaletteColor;
    surface: string;
    onSurface: string;
    surfaceVariant: string;
    onSurfaceVariant: string;
    elevation: {
      level0: string;
      level1: string;
      level2: string;
      level3: string;
      level4: string;
      level5: string;
    };
  }

  interface PaletteOptions {
    trendUp?: string;
    trendDown?: string;
    skeleton?: string;
    skeletonHighlight?: string;
    successContainer?: string;
    infoContainer?: string;
    neutral?: string;
    neutralContainer?: string;
    danger?: string;
    buttonBorder?: string;
    exchangeCardBorder?: string;
    tertiary?: PaletteColorOptions;
    surface?: string;
    onSurface?: string;
    surfaceVariant?: string;
    onSurfaceVariant?: string;
    elevation?: {
      level0?: string;
      level1?: string;
      level2?: string;
      level3?: string;
      level4?: string;
      level5?: string;
    };
  }

  interface Theme {
    appSpacing: {
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
  }

  interface ThemeOptions {
    appSpacing?: {
      xs: number;
      s: number;
      m: number;
      l: number;
      xl: number;
      xxl: number;
    };
  }
}

// --- Constantes de Diseño ---
export const spacing = {
  xs: 4,
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 24,
};

const lightColors = {
  primary: '#006C4C',
  onPrimary: '#FFFFFF',
  primaryContainer: '#89F8C6',
  onPrimaryContainer: '#002114',
  secondary: '#4C6358',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#CEE9DA',
  onSecondaryContainer: '#092016',
  tertiary: '#3E6373',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#C2E8FB',
  onTertiaryContainer: '#001F29',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#410002',
  background: '#FBFDF9',
  onBackground: '#191C1A',
  surface: '#FBFDF9',
  onSurface: '#191C1A',
  surfaceVariant: '#DBE5DE',
  onSurfaceVariant: '#404944',
  outline: 'rgba(0, 0, 0, 0.05)',
  outlineVariant: '#E0E6E2',
  buttonBorder: '#5F6964',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#2E312F',
  inverseOnSurface: '#F0F2EE',
  inversePrimary: '#6DDBAC',
  elevation: {
    level0: 'transparent',
    level1: '#F0F5F2',
    level2: '#EAF1ED',
    level3: '#E4EDE8',
    level4: '#E2ECE7',
    level5: '#DDE9E4',
  },
};

const darkColors = {
  primary: '#6DDBAC',
  onPrimary: '#003825',
  primaryContainer: '#005138',
  onPrimaryContainer: '#89F8C6',
  secondary: '#B3CCBE',
  onSecondary: '#1F352B',
  secondaryContainer: '#354B41',
  onSecondaryContainer: '#CEE9DA',
  tertiary: '#A6CCE0',
  onTertiary: '#083543',
  tertiaryContainer: '#254B5B',
  onTertiaryContainer: '#C2E8FB',
  error: '#FFB4AB',
  onError: '#690005',
  errorContainer: '#93000A',
  onErrorContainer: '#FFDAD6',
  background: '#191C1A',
  onBackground: '#E2E3DF',
  surface: '#191C1A',
  onSurface: '#E2E3DF',
  surfaceVariant: '#404944',
  onSurfaceVariant: '#C0C9C2',
  outline: '#2A302D',
  outlineVariant: '#1F2321',
  buttonBorder: '#B3BEB9',
  shadow: '#000000',
  scrim: '#000000',
  backdrop: 'rgba(0, 0, 0, 0.8)',
  inverseSurface: '#E2E3DF',
  inverseOnSurface: '#2E312F',
  inversePrimary: '#006C4C',
  elevation: {
    level0: 'transparent',
    level1: '#212523',
    level2: '#262A28',
    level3: '#2B2F2D',
    level4: '#2C312E',
    level5: '#303532',
  },
};

const semanticColors = {
  trendUp: '#006C4C',
  trendDown: '#BA1A1A',
  success: { main: '#006C4C' },
  successContainer: '#89F8C6',
  info: { main: '#3E6373' },
  infoContainer: '#C2E8FB',
  neutral: '#4C6358',
  neutralContainer: '#CEE9DA',
  danger: '#BA1A1A',
  warning: { main: '#E6C449' },
};

type ColorModeContextType = {
  toggleColorMode: () => void;
  mode: 'light' | 'dark';
};

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Detectar preferencia inicial del navegador
    const newMode = prefersDarkMode ? 'dark' : 'light';
    if (mode !== newMode) {
      setMode(newMode);
    }
    setMounted(true);
  }, [prefersDarkMode, mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Configuración modo claro
                primary: {
                  main: lightColors.primary,
                  contrastText: lightColors.onPrimary,
                },
                secondary: {
                  main: lightColors.secondary,
                  contrastText: lightColors.onSecondary,
                },
                tertiary: {
                  main: lightColors.tertiary,
                  contrastText: lightColors.onTertiary,
                },
                error: {
                  main: lightColors.error,
                  contrastText: lightColors.onError,
                },
                background: {
                  default: lightColors.background,
                  paper: lightColors.elevation.level1,
                },
                text: {
                  primary: lightColors.onBackground,
                  secondary: lightColors.onSurfaceVariant,
                },
                // Custom & Semantic
                ...semanticColors,
                trendUp: '#168953', // Darker green for accessibility (WCAG AA)
                trendDown: '#D32F2F',
                warning: { main: '#F57C00' },
                skeleton: '#E1E9EE',
                skeletonHighlight: '#F2F8FC',
                buttonBorder: lightColors.buttonBorder,
                exchangeCardBorder: 'rgba(255, 255, 255, 0.05)',
                surface: lightColors.surface,
                onSurface: lightColors.onSurface,
                surfaceVariant: lightColors.surfaceVariant,
                onSurfaceVariant: lightColors.onSurfaceVariant,
                elevation: lightColors.elevation,
              }
            : {
                // Configuración modo oscuro
                primary: {
                  main: darkColors.primary,
                  contrastText: darkColors.onPrimary,
                },
                secondary: {
                  main: darkColors.secondary,
                  contrastText: darkColors.onSecondary,
                },
                tertiary: {
                  main: darkColors.tertiary,
                  contrastText: darkColors.onTertiary,
                },
                error: {
                  main: darkColors.error,
                  contrastText: darkColors.onError,
                },
                background: {
                  default: darkColors.background,
                  paper: darkColors.elevation.level1,
                },
                text: {
                  primary: darkColors.onBackground,
                  secondary: darkColors.onSurfaceVariant,
                },
                // Custom & Semantic
                ...semanticColors,
                trendUp: '#00FF94',
                trendDown: '#FF4D4D',
                success: { main: darkColors.primary },
                successContainer: '#005138',
                info: { main: darkColors.tertiary },
                infoContainer: '#254B5B',
                neutral: darkColors.secondary,
                neutralContainer: '#354B41',
                danger: darkColors.error,
                warning: { main: '#FFCC80' },
                skeleton: '#2C312E',
                skeletonHighlight: '#303532',
                buttonBorder: darkColors.buttonBorder,
                exchangeCardBorder: 'rgba(255, 255, 255, 0.15)',
                surface: darkColors.surface,
                onSurface: darkColors.onSurface,
                surfaceVariant: darkColors.surfaceVariant,
                onSurfaceVariant: darkColors.onSurfaceVariant,
                elevation: darkColors.elevation,
              }),
        },
        appSpacing: spacing,
        typography: {
          fontFamily: 'inherit',
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                textTransform: 'none', // Material 3 style
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: ({ theme, ownerState }) => ({
                backgroundImage: 'none',
                // Mapeo dinámico de elevaciones de Material You
                backgroundColor: 
                  ownerState.elevation === 0 ? theme.palette.elevation.level0 :
                  ownerState.elevation === 1 ? theme.palette.elevation.level1 :
                  ownerState.elevation === 2 ? theme.palette.elevation.level2 :
                  ownerState.elevation === 3 ? theme.palette.elevation.level3 :
                  ownerState.elevation === 4 ? theme.palette.elevation.level4 :
                  ownerState.elevation === 5 ? theme.palette.elevation.level5 :
                  theme.palette.elevation.level1, // Default
              }),
            },
          },
        },
      }),
    [mode]
  );

  // Evitar desajustes de hidratación
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};
