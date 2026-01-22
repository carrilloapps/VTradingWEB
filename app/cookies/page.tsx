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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CookieIcon from '@mui/icons-material/Cookie';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';

export default function CookiesPage() {
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
            <Typography color="text.primary">Política de Cookies</Typography>
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
                mb: 6,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Política de Cookies
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" /> 1. ¿Qué son las cookies?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Las cookies son pequeños archivos de texto que los sitios web que visita guardan en su ordenador o dispositivo móvil. Permiten que el sitio web recuerde sus acciones y preferencias (como inicio de sesión, idioma, tamaño de fuente y otras preferencias de visualización) durante un período de tiempo, para que no tenga que volver a introducirlas cada vez que vuelva al sitio o navegue de una página a otra.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CookieIcon color="primary" /> 2. ¿Cómo utilizamos las cookies?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  En VTrading, utilizamos cookies para mejorar su experiencia de navegación, analizar el tráfico del sitio y personalizar el contenido. Específicamente, utilizamos:
                </Typography>
                <List sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03), borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
                  <ListItem>
                    <ListItemIcon>
                      <CookieIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cookies esenciales" 
                      secondary="Necesarias para el funcionamiento del sitio web." 
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <BarChartIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cookies de rendimiento" 
                      secondary="Nos ayudan a entender cómo interactúan los visitantes con el sitio." 
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cookies de funcionalidad" 
                      secondary="Permiten recordar sus preferencias." 
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                </List>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SettingsIcon color="primary" /> 3. Gestión de cookies
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Puede controlar y/o eliminar las cookies según desee. Puede eliminar todas las cookies que ya están en su ordenador y puede configurar la mayoría de los navegadores para evitar que se coloquen.
                </Typography>
                <Alert severity="warning" variant="outlined" sx={{ mt: 2, mb: 2 }}>
                  <AlertTitle>Importante</AlertTitle>
                  Si decide deshabilitar las cookies, es posible que tenga que ajustar manualmente algunas preferencias cada vez que visite un sitio y que <strong>algunos servicios y funcionalidades no funcionen correctamente</strong>.
                </Alert>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  4. Actualizaciones de esta política
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Podemos actualizar nuestra Política de Cookies de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Cookies en esta página.
                </Typography>
              </section>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
