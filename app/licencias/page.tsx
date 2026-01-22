'use client';

import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Grid
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import HandshakeIcon from '@mui/icons-material/Handshake';

export default function LicenciasPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        component="main"
        sx={{ 
          flexGrow: 1,
          pt: { xs: 16, md: 20 }, 
          pb: { xs: 8, md: 12 },
          position: 'relative',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      >
        <Container maxWidth="lg">
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />} 
            aria-label="breadcrumb"
            sx={{ mb: 4 }}
          >
            <MuiLink component={Link} href="/" color="inherit" underline="hover">
              Inicio
            </MuiLink>
            <Typography color="text.primary">Licencias</Typography>
          </Breadcrumbs>

          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 4, md: 8 }, 
              borderRadius: 4, 
              border: `1px solid ${theme.palette.divider}`, 
              bgcolor: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)'
            }}
          >
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '2rem', md: '3rem' }, 
                fontWeight: 800, 
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Licenciamiento y Planes
            </Typography>
            
            <Typography variant="h5" color="text.secondary" sx={{ mb: 6, maxWidth: '800px' }}>
              Soluciones escalables diseñadas para adaptarse al volumen de operaciones de su negocio financiero.
            </Typography>

            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
                  <SpeedIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">Basado en RPM</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nuestros costos se calculan de manera transparente basándose en las Requests Per Minute (RPM) que su sistema requiere, asegurando que solo pague por la capacidad que utiliza.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
                  <HandshakeIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">Planes Flexibles</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ofrecemos tanto planes preestablecidos para startups y PYMES, como soluciones Enterprise customizadas para instituciones con alto volumen transaccional.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2, height: '100%' }}>
                  <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                  <Typography variant="h6" gutterBottom fontWeight="bold">Soporte Dedicado</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Todos nuestros planes de licencia incluyen soporte técnico especializado y SLAs garantizados para asegurar la continuidad de su operación.
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05), 
              p: 4, 
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              textAlign: 'center'
            }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ¿Listo para escalar su operación?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
                Para obtener una cotización detallada de nuestros planes preestablecidos o diseñar una solución a medida, por favor póngase en contacto con nuestro equipo de ventas.
              </Typography>
              <Button 
                component={Link} 
                href="/contacto" 
                variant="contained" 
                size="large"
                sx={{ 
                  borderRadius: 50,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  fontWeight: 700
                }}
              >
                Contactar Ventas
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
