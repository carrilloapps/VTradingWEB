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
  Grid
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SecurityIcon from '@mui/icons-material/Security';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import StorageIcon from '@mui/icons-material/Storage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ShareIcon from '@mui/icons-material/Share';
import GavelIcon from '@mui/icons-material/Gavel';

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
              Política de Privacidad
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" /> 1. Información que Recopilamos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  En VTrading, recopilamos información limitada necesaria para proporcionarle nuestros servicios. Esto incluye:
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Información de Cuenta</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Cuando se registra utilizando Google Auth, recibimos su dirección de correo electrónico, nombre y foto de perfil.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <StorageIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Datos de Uso</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Recopilamos métricas sobre su interacción con nuestra API y plataforma, incluyendo RPM (peticiones por minuto).
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                        <EmailIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight="bold">Comunicaciones</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Información que nos proporciona cuando contacta con nuestro soporte técnico.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="primary" /> 2. Uso de la Información
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Utilizamos la información recopilada para:
                </Typography>
                <List>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Proporcionar, mantener y mejorar nuestros servicios." />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Procesar transacciones y gestionar su suscripción." />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Enviar notificaciones técnicas, actualizaciones de seguridad y mensajes administrativos." />
                  </ListItem>
                  <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon><CheckCircleIcon color="success" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Detectar, investigar y prevenir actividades fraudulentas o no autorizadas." />
                  </ListItem>
                </List>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" /> 3. Seguridad de los Datos
                </Typography>
                <Alert severity="success" icon={<SecurityIcon fontSize="inherit" />} sx={{ borderRadius: 2 }}>
                  <AlertTitle>Infraestructura Segura</AlertTitle>
                  La seguridad de sus datos es nuestra prioridad. Utilizamos servicios de infraestructura de clase mundial (Firebase/Google Cloud) que implementan medidas de seguridad avanzadas para proteger su información contra el acceso no autorizado, la alteración o la destrucción.
                </Alert>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Nota: No almacenamos datos sensibles de pago directamente en nuestros servidores.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShareIcon color="primary" /> 4. Compartir Información
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.05), borderColor: alpha(theme.palette.info.main, 0.2) }}>
                  <Typography variant="body1" color="text.secondary">
                    No vendemos, comercializamos ni transferimos su información personal a terceros. Esto no incluye a los terceros de confianza que nos ayudan a operar nuestro sitio web o llevar a cabo nuestro negocio, siempre que dichas partes acuerden mantener esta información confidencial.
                  </Typography>
                </Paper>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GavelIcon color="primary" /> 5. Sus Derechos
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Usted tiene derecho a acceder, corregir o eliminar su información personal en cualquier momento. Puede ejercer estos derechos a través de la configuración de su cuenta o contactándonos directamente a través de nuestra página de contacto.
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
