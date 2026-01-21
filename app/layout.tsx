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
  title: "VTrading",
  description: "Plataforma avanzada de análisis y gestión de trading",
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
