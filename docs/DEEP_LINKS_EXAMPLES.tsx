/**
 * EJEMPLO: Cómo agregar Deep Links a tus páginas
 * 
 * Este archivo muestra diferentes formas de integrar deep links
 * en tu aplicación Next.js
 */

// ============================================================
// EJEMPLO 1: Agregar banner global en el layout principal
// ============================================================

// En app/layout.tsx, importa y usa GlobalAppBanner:

/*
import { GlobalAppBanner } from '@/components/GlobalAppBanner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <GlobalAppBanner />
        {children}
      </body>
    </html>
  );
}
*/

// ============================================================
// EJEMPLO 2: Banner específico en una página
// ============================================================

/*
// app/articulos/[slug]/page.tsx
import { SmartAppBanner } from '@/components/SmartAppBanner';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <>
      <SmartAppBanner
        deepLinkConfig={{
          type: 'article',
          path: slug,
        }}
        title="VTradingAPP"
        description="Lee este artículo en la app"
      />
      
      <article>
        <h1>Mi Artículo</h1>
        {/* contenido */}
      </article>
    </>
  );
}
*/

// ============================================================
// EJEMPLO 3: Botón para abrir contenido en la app
// ============================================================

/*
'use client';

import { OpenAppButton } from '@/components/OpenAppButton';
import { Stack } from '@mui/material';

export function ArticleActions({ slug }: { slug: string }) {
  return (
    <Stack direction="row" spacing={2}>
      <OpenAppButton
        deepLinkConfig={{
          type: 'article',
          path: slug,
        }}
        text="Leer en la app"
        variant="contained"
        color="primary"
        goToStoreOnNotInstalled
      />
    </Stack>
  );
}
*/

// ============================================================
// EJEMPLO 4: Compartir con deep links
// ============================================================

/*
'use client';

import { Button, IconButton } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useShareDeepLink } from '@/lib/use-deep-links';

export function ShareArticle({ 
  slug, 
  title 
}: { 
  slug: string; 
  title: string; 
}) {
  const { share, copyToClipboard, isSharing } = useShareDeepLink({
    type: 'article',
    path: slug,
  });

  return (
    <>
      <Button
        startIcon={<ShareIcon />}
        onClick={() => share({ title, text: `Lee "${title}" en VTradingAPP` })}
        disabled={isSharing}
      >
        Compartir
      </Button>
      
      <IconButton
        onClick={async () => {
          const success = await copyToClipboard();
          if (success) {
            alert('¡Enlace copiado!');
          }
        }}
      >
        <ContentCopyIcon />
      </IconButton>
    </>
  );
}
*/

// ============================================================
// EJEMPLO 5: Detectar plataforma y mostrar contenido condicional
// ============================================================

/*
'use client';

import { usePlatform } from '@/lib/use-deep-links';
import { Box, Typography } from '@mui/material';

export function PlatformSpecificMessage() {
  const platform = usePlatform();

  if (platform.isIOS) {
    return (
      <Box sx={{ p: 2, bgcolor: 'info.light' }}>
        <Typography>
          📱 Disponible en App Store
        </Typography>
      </Box>
    );
  }

  if (platform.isAndroid) {
    return (
      <Box sx={{ p: 2, bgcolor: 'success.light' }}>
        <Typography>
          🤖 Disponible en Google Play
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.100' }}>
      <Typography>
        💻 Visítanos desde tu móvil para descargar la app
      </Typography>
    </Box>
  );
}
*/

// ============================================================
// EJEMPLO 6: Generar links manualmente (sin componentes)
// ============================================================

/*
import { generateDeepLink, generateShareLink } from '@/lib/deep-links';

// En una Server Action o API route:
export async function createShareableLink(articleSlug: string) {
  const shareUrl = generateShareLink(
    {
      type: 'article',
      path: articleSlug,
    },
    'email' // source for tracking
  );

  return shareUrl;
  // Retorna: https://vtrading.app/article-slug?utm_source=email&utm_medium=web&utm_campaign=deeplink_share
}

// Para obtener todas las variantes:
const links = generateDeepLink({
  type: 'article',
  path: 'bitcoin-news',
});

console.log(links);
// {
//   customScheme: 'vtrading://article/bitcoin-news',
//   universalLink: 'https://vtrading.app/bitcoin-news',
//   fallbackLink: 'https://discover.vtrading.app/bitcoin-news'
// }
*/

// ============================================================
// EJEMPLO 7: Página completa con todos los features
// ============================================================

/*
'use client';

import { SmartAppBanner } from '@/components/SmartAppBanner';
import { OpenAppButton } from '@/components/OpenAppButton';
import { useShareDeepLink, usePlatform } from '@/lib/use-deep-links';
import { Container, Typography, Button, Stack, Chip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';

export default function FullExamplePage() {
  const platform = usePlatform();
  const { share } = useShareDeepLink({
    type: 'article',
    path: 'ejemplo-completo',
  });

  return (
    <>
      {/ * Banner en la parte superior * /}
      <SmartAppBanner
        deepLinkConfig={{
          type: 'article',
          path: 'ejemplo-completo',
        }}
      />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>
          Artículo de Ejemplo
        </Typography>

        {/ * Mostrar plataforma detectada * /}
        {platform.isMobile && (
          <Chip 
            label={platform.isIOS ? 'iOS' : 'Android'} 
            color="primary" 
            size="small" 
            sx={{ mb: 2 }}
          />
        )}

        <Typography paragraph>
          Este es un ejemplo completo de cómo usar deep links en tu página.
        </Typography>

        {/ * Botones de acción * /}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <OpenAppButton
            deepLinkConfig={{
              type: 'article',
              path: 'ejemplo-completo',
            }}
            text="Abrir en app"
            variant="contained"
            goToStoreOnNotInstalled
          />

          <Button
            variant="outlined"
            startIcon={<ShareIcon />}
            onClick={() => share({
              title: 'Artículo de Ejemplo',
              text: 'Mira esto en VTradingAPP',
            })}
          >
            Compartir
          </Button>
        </Stack>
      </Container>
    </>
  );
}
*/

// ============================================================
// EJEMPLO 8: Integración con el Navbar existente
// ============================================================

/*
'use client';

import { AppBar, Toolbar, Button } from '@mui/material';
import { OpenAppButton } from '@/components/OpenAppButton';
import { usePlatform } from '@/lib/use-deep-links';

export function NavbarWithAppButton() {
  const platform = usePlatform();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          VTrading
        </Typography>

        {/ * Mostrar solo en móviles * /}
        {platform.isMobile && (
          <OpenAppButton
            deepLinkConfig={{ type: 'home', path: '' }}
            text="App"
            variant="outlined"
            color="inherit"
            size="small"
          />
        )}
      </Toolbar>
    </AppBar>
  );
}
*/

export {};
