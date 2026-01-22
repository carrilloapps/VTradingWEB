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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import WarningIcon from '@mui/icons-material/Warning';
import GavelIcon from '@mui/icons-material/Gavel';
import BlockIcon from '@mui/icons-material/Block';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SecurityIcon from '@mui/icons-material/Security';
import CopyrightIcon from '@mui/icons-material/Copyright';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import AdsClickIcon from '@mui/icons-material/AdsClick';

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
                Términos y Condiciones de Uso
              </Typography>
              <Chip label="Última actualización: 21 de Enero de 2026" color="primary" variant="outlined" size="small" />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" /> 1. Naturaleza del Servicio (No Transaccional)
                </Typography>
                <Alert 
                  severity="warning" 
                  variant="filled" 
                  sx={{ 
                    mt: 2, 
                    borderRadius: 2,
                    '& .MuiAlert-message': { width: '100%' }
                  }}
                >
                  <AlertTitle sx={{ fontWeight: 'bold' }}>ADVERTENCIA IMPORTANTE</AlertTitle>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    VTrading es <strong>EXCLUSIVAMENTE</strong> una plataforma de monitoreo, análisis e inteligencia de datos financieros. 
                    <br /><br />
                    <strong>NO SOMOS:</strong>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px', listStyleType: 'disc' }}>
                      <li>Un banco o institución financiera.</li>
                      <li>Una billetera digital (wallet).</li>
                      <li>Una plataforma de inversión o trading.</li>
                      <li>Un intermediario financiero.</li>
                      <li>Operadores o corredores de bolsa.</li>
                    </ul>
                    En ningún momento captamos fondos, custodiamos activos de usuarios ni procesamos transacciones monetarias entre particulares.
                  </Typography>
                </Alert>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GavelIcon color="primary" /> 2. Aceptación de los Términos
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Al acceder y utilizar VTrading (Web o App Móvil), usted acepta cumplir y estar legalmente obligado por los presentes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SmartphoneIcon color="primary" /> 3. Permisos y Uso de la Aplicación Móvil
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Para el correcto funcionamiento de la aplicación móvil VTrading, el usuario acepta otorgar los siguientes permisos necesarios:
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Permiso</strong></TableCell>
                        <TableCell><strong>Propósito</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>INTERNET / NETWORK</TableCell>
                        <TableCell>Comunicación con la API y verificación de conectividad.</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>NOTIFICATIONS (POST_NOTIFICATIONS)</TableCell>
                        <TableCell>Envío de alertas de precios y noticias relevantes.</TableCell>
                      </TableRow>
                       <TableRow>
                        <TableCell>AD_ID (Publicidad)</TableCell>
                        <TableCell>Identificador para analíticas y publicidad (en versión gratuita).</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon color="primary" /> 4. Servicios y Suscripciones
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  VTrading ofrece acceso a datos financieros y herramientas de análisis. El acceso se rige por planes de suscripción y límites de uso (RPM).
                </Typography>
                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                  El usuario se compromete a no exceder los límites establecidos en su plan. El uso no autorizado o excesivo de la API puede resultar en la suspensión temporal o permanente del servicio.
                </Alert>
              </section>

              <Divider />

               <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AdsClickIcon color="primary" /> 5. Publicidad y Versión Gratuita
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Los usuarios de la versión gratuita aceptan la visualización de anuncios publicitarios proporcionados por terceros (Google AdMob). Estos anuncios son necesarios para mantener la gratuidad del servicio básico.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="error" /> 6. Descargo de Responsabilidad Financiera
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, bgcolor: alpha(theme.palette.error.main, 0.05), borderColor: alpha(theme.palette.error.main, 0.2) }}>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    La información proporcionada por VTrading es únicamente con fines informativos y educativos.
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="error" paragraph>
                    No constituye asesoramiento financiero, de inversión o comercial.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    VTrading no se hace responsable de las decisiones financieras tomadas por el usuario basadas en la información de la plataforma. El trading conlleva riesgos significativos y usted debe consultar con un asesor financiero certificado antes de tomar decisiones de inversión.
                  </Typography>
                </Paper>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BlockIcon color="primary" /> 7. Uso Aceptable
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Queda estrictamente prohibido utilizar la plataforma para:
                </Typography>
                <List sx={{ bgcolor: alpha(theme.palette.background.paper, 0.5), borderRadius: 2 }}>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Realizar ingeniería inversa, descompilar o intentar extraer el código fuente." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Revender, sublicenciar o redistribuir los datos sin autorización expresa." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Realizar actividades fraudulentas o ilegales." />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><BlockIcon color="error" fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Interferir con la seguridad o el rendimiento de nuestros servidores." />
                  </ListItem>
                </List>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CopyrightIcon color="primary" /> 8. Propiedad Intelectual
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Todos los derechos, títulos e intereses sobre la plataforma, incluyendo pero no limitado a software, textos, gráficos, logotipos y marcas, son propiedad exclusiva de VTrading o sus licenciantes y están protegidos por las leyes de propiedad intelectual internacionales.
                </Typography>
              </section>

              <Divider />

              <section>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon color="primary" /> 9. Limitación de Responsabilidad
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
