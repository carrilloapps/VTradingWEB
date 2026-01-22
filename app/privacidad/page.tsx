'use client';

import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Paper,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

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
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  1. Información que Recopilamos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  En VTrading, recopilamos información limitada necesaria para proporcionarle nuestros servicios. Esto incluye:
                </Typography>
                <Typography component="ul" variant="body1" color="text.secondary" sx={{ pl: 4 }}>
                  <li><strong>Información de Cuenta:</strong> Cuando se registra utilizando Google Auth, recibimos su dirección de correo electrónico, nombre y foto de perfil.</li>
                  <li><strong>Datos de Uso:</strong> Recopilamos métricas sobre su interacción con nuestra API y plataforma, incluyendo RPM (peticiones por minuto) para la gestión de su plan.</li>
                  <li><strong>Comunicaciones:</strong> Información que nos proporciona cuando contacta con nuestro soporte técnico.</li>
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  2. Uso de la Información
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Utilizamos la información recopilada para:
                </Typography>
                <Typography component="ul" variant="body1" color="text.secondary" sx={{ pl: 4 }}>
                  <li>Proporcionar, mantener y mejorar nuestros servicios.</li>
                  <li>Procesar transacciones y gestionar su suscripción.</li>
                  <li>Enviar notificaciones técnicas, actualizaciones de seguridad y mensajes administrativos.</li>
                  <li>Detectar, investigar y prevenir actividades fraudulentas o no autorizadas.</li>
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  3. Seguridad de los Datos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  La seguridad de sus datos es nuestra prioridad. Utilizamos servicios de infraestructura de clase mundial (Firebase/Google Cloud) que implementan medidas de seguridad avanzadas para proteger su información contra el acceso no autorizado, la alteración o la destrucción. No almacenamos datos sensibles de pago directamente en nuestros servidores.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  4. Compartir Información
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  No vendemos, comercializamos ni transferimos su información personal a terceros. Esto no incluye a los terceros de confianza que nos ayudan a operar nuestro sitio web o llevar a cabo nuestro negocio, siempre que dichas partes acuerden mantener esta información confidencial.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  5. Sus Derechos
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
