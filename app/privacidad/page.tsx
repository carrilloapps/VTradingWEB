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
  Grid,
  Chip
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import GavelIcon from '@mui/icons-material/Gavel';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BusinessIcon from '@mui/icons-material/Business';

export default function PrivacidadPage() {
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
            <Typography color="text.primary">Política de Privacidad</Typography>
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
                Política de Privacidad y Datos
              </Typography>
              <Chip label="Última actualización: 21 de Enero de 2026" color="primary" variant="outlined" size="small" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" /> 1. Información que Recopilamos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  En VTrading (Web y App), recopilamos información específica para garantizar el funcionamiento, la seguridad y la personalización del servicio.
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Autenticación (Firebase Auth)</Typography>
                      </Box>
                      <List dense>
                        <ListItem disablePadding>
                          <ListItemText primary="Email y Contraseña" secondary="Para gestión de cuenta." />
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemText primary="Identidad de Google" secondary="Nombre, email y foto (si usa Social Login)." />
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemText primary="Firebase UID" secondary="Identificador único interno." />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <StorageIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Analíticas y Rendimiento</Typography>
                      </Box>
                      <List dense>
                         <ListItem disablePadding>
                          <ListItemText primary="Eventos de Navegación" secondary="Pantallas visitadas y tiempo de uso." />
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemText primary="Datos del Dispositivo" secondary="Modelo, SO, resolución y preferencias." />
                        </ListItem>
                         <ListItem disablePadding>
                          <ListItemText primary="Logs de Errores" secondary="Crashlytics para diagnósticos." />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                   <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <CampaignIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Publicidad (AdMob)</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Para usuarios no premium, utilizamos identificadores de publicidad (AdID) para mostrar anuncios relevantes a través de Google AdMob.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <NotificationsIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Notificaciones (FCM)</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                         Utilizamos Tokens de Dispositivo para enviar alertas de precios y notificaciones push segmentadas.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon color="primary" /> 2. Proveedores de Servicios
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Compartimos datos estrictamente necesarios con proveedores de infraestructura de confianza:
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                        primary="Google / Firebase" 
                        secondary="Infraestructura principal: Autenticación, Base de Datos, Analíticas y Notificaciones." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                        primary="Google AdMob" 
                        secondary="Proveedor de servicios publicitarios para versiones gratuitas." 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText 
                        primary="VTrading API" 
                        secondary="Proveedor de datos de mercado y financieros." 
                    />
                  </ListItem>
                </List>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" /> 3. Seguridad de los Datos
                </Typography>
                <Alert severity="success" icon={<SecurityIcon fontSize="inherit" />} sx={{ borderRadius: 2 }}>
                  <AlertTitle>Infraestructura Protegida</AlertTitle>
                  Implementamos estándares de seguridad de la industria:
                  <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
                    <li><strong>Firebase App Check:</strong> Protege nuestra API contra tráfico no autorizado y bots.</li>
                    <li><strong>HTTPS/TLS:</strong> Cifrado en tránsito para todas las comunicaciones de red.</li>
                    <li><strong>Minimización:</strong> No solicitamos permisos invasivos como Cámara o Micrófono.</li>
                  </ul>
                </Alert>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShareIcon color="primary" /> 4. Compartir Información
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderColor: alpha(theme.palette.info.main, 0.2) }}>
                  <Typography variant="body1" color="text.secondary">
                    No vendemos sus datos personales. La información compartida con terceros (como Google) es exclusivamente para la operatividad del servicio (analítica, publicidad y autenticación).
                  </Typography>
                </Paper>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GavelIcon color="primary" /> 5. Sus Derechos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Usted tiene derecho a solicitar la eliminación de su cuenta y todos los datos asociados (incluyendo UID y logs) a través de la configuración de la aplicación o contactando a soporte.
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
