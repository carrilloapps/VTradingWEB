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

export default function TerminosPage() {
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
            <Typography color="text.primary">Términos y Condiciones</Typography>
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
              Términos y Condiciones de Uso
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  1. Aceptación de los Términos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Al acceder y utilizar VTrading (en adelante, &quot;la Plataforma&quot;), usted acepta cumplir y estar legalmente obligado por los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  2. Servicios y Licencias
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  VTrading ofrece acceso a datos financieros y herramientas de análisis. El acceso a nuestros servicios se rige por planes de suscripción basados en RPM (Requests Per Minute). El usuario se compromete a no exceder los límites establecidos en su plan contratado. El uso no autorizado o excesivo de la API puede resultar en la suspensión temporal o permanente del servicio.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  3. Descargo de Responsabilidad Financiera
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  La información proporcionada por VTrading es únicamente con fines informativos y educativos. <strong>No constituye asesoramiento financiero, de inversión o comercial.</strong> VTrading no se hace responsable de las decisiones financieras tomadas por el usuario basadas en la información de la plataforma. El trading conlleva riesgos significativos y usted debe consultar con un asesor financiero certificado antes de tomar decisiones de inversión.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  4. Uso Aceptable
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Queda estrictamente prohibido utilizar la plataforma para:
                </Typography>
                <Typography component="ul" variant="body1" color="text.secondary" sx={{ pl: 4 }}>
                  <li>Realizar ingeniería inversa, descompilar o intentar extraer el código fuente.</li>
                  <li>Revender, sublicenciar o redistribuir los datos sin autorización expresa.</li>
                  <li>Realizar actividades fraudulentas o ilegales.</li>
                  <li>Interferir con la seguridad o el rendimiento de nuestros servidores.</li>
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  5. Propiedad Intelectual
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Todos los derechos, títulos e intereses sobre la plataforma, incluyendo pero no limitado a software, textos, gráficos, logotipos y marcas, son propiedad exclusiva de VTrading o sus licenciantes y están protegidos por las leyes de propiedad intelectual internacionales.
                </Typography>
              </section>

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  6. Limitación de Responsabilidad
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  En la medida máxima permitida por la ley, VTrading no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos, ni de ninguna pérdida de beneficios o ingresos, ya sea incurrida directa o indirectamente, o cualquier pérdida de datos, uso, fondo de comercio u otras pérdidas intangibles.
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
