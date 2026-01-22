import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MUIProvider from "@/components/MUIProvider";
import { MarketProvider } from "@/context/MarketContext";
import { getMarketDataAction } from "@/app/actions/market";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vtrading.app'),
  title: {
    default: "VTrading | Plataforma de Análisis Financiero y Trading",
    template: "%s | VTrading"
  },
  description: "Monitorea mercados en tiempo real, analiza tendencias y optimiza tus estrategias de trading con VTrading. Datos financieros precisos y herramientas profesionales.",
  keywords: ["trading", "finanzas", "mercados", "criptomonedas", "forex", "acciones", "análisis técnico", "vtrading", "inversiones"],
  authors: [{ name: "VTrading Team", url: "https://vtrading.app" }],
  creator: "VTrading",
  publisher: "VTrading",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/images/favicon.ico', sizes: 'any' },
      { url: '/images/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/images/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/images/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/images/icon-192-maskable.png', color: '#5D3FD3' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "VTrading | Inteligencia de Mercados",
    description: "Plataforma líder en análisis de mercados financieros. Datos en tiempo real, gráficos avanzados y herramientas para traders profesionales.",
    url: 'https://vtrading.app',
    siteName: 'VTrading',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/images/icon-512.png',
        width: 512,
        height: 512,
        alt: 'VTrading Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "VTrading | Análisis Financiero",
    description: "Datos de mercado en tiempo real y herramientas de análisis profesional.",
    creator: '@vtradingapp',
    images: ['/images/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://vtrading.app',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial market data globally
  let initialMarketData = null;
  try {
    initialMarketData = await getMarketDataAction();
  } catch (error) {
    console.error("Failed to fetch initial market data in RootLayout:", error);
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MUIProvider>
          <MarketProvider initialData={initialMarketData}>
            {children}
          </MarketProvider>
        </MUIProvider>
      </body>
    </html>
  );
}
