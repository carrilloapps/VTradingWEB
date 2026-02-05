'use client';

import Link from 'next/link';
import { Box, Container, Typography, Button, useTheme, alpha, Fade } from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeIcon from '@mui/icons-material/Home';

export default function NotFound() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: { xs: 16, md: 24 },
          pb: { xs: 8, md: 8 },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Box>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
                  mb: 4,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'error.main',
                    fontSize: '0.875rem',
                  }}
                >
                  Error 404
                </Typography>
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '6rem' },
                  fontWeight: 800,
                  lineHeight: 1,
                  mb: 2,
                  letterSpacing: '-0.03em',
                }}
              >
                Página no{' '}
                <Box
                  component="span"
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.error.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  encontrada
                </Box>
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 6, maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}
              >
                Lo sentimos, la página que estás buscando no existe o ha sido movida. Verifica la
                URL o regresa al inicio.
              </Typography>

              <Button
                component={Link}
                href="/"
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
