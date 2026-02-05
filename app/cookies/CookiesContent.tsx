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
  Divider,
  Chip,
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CookieIcon from '@mui/icons-material/Cookie';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import StorageIcon from '@mui/icons-material/Storage';

export default function CookiesPage() {
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
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ mb: 6 }}>
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
                Política de Cookies y Datos Locales
              </Typography>
              <Chip
                label="Última actualización: 21 de Enero de 2026"
                color="primary"
                variant="outlined"
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <InfoIcon color="primary" /> 1. ¿Qué son las cookies y el almacenamiento local?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Las cookies y las tecnologías de almacenamiento local (como AsyncStorage o
                  LocalStorage) permiten que nuestra aplicación web y móvil guarde información en su
                  dispositivo para mejorar el rendimiento y recordar sus preferencias.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <CookieIcon color="primary" /> 2. Tecnologías Específicas que Utilizamos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  En VTrading (Web y App), utilizamos los siguientes mecanismos de persistencia de
                  datos:
                </Typography>
                <List
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.03),
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="api_cache_*"
                      secondary="Caché temporal de tasas de cambio y datos financieros (TTL: 5 min) para reducir el consumo de datos y mejorar la velocidad."
                      primaryTypographyProps={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <SettingsIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="app_settings"
                      secondary="Almacena sus preferencias de usuario, como el tema (claro/oscuro) y configuración de notificaciones."
                      primaryTypographyProps={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <StorageIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="user_alerts & widget_config"
                      secondary="Guarda localmente sus alertas de precios configuradas y la personalización de widgets."
                      primaryTypographyProps={{ fontWeight: 'bold', fontFamily: 'monospace' }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <ListItemIcon>
                      <CookieIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Firebase Auth Token"
                      secondary="Mantiene su sesión activa de forma segura para que no tenga que iniciar sesión cada vez."
                      primaryTypographyProps={{ fontWeight: 'bold' }}
                    />
                  </ListItem>
                </List>
              </section>

              <Divider />

              <section>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                  <SettingsIcon color="primary" /> 3. Gestión de Datos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Puede controlar y eliminar estos datos limpiando la caché de su navegador o los
                  datos de la aplicación en su dispositivo móvil.
                </Typography>
                <Alert severity="warning" variant="outlined" sx={{ mt: 2, mb: 2 }}>
                  <AlertTitle>Importante</AlertTitle>
                  Si elimina estos datos, deberá iniciar sesión nuevamente y perderá sus
                  configuraciones personalizadas y alertas guardadas localmente.
                </Alert>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  4. Actualizaciones
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Podemos actualizar esta política para reflejar cambios en nuestra tecnología de
                  almacenamiento.
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
