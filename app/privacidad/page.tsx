'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  alpha,
  Paper,
  Fade,
  Breadcrumbs
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function PrivacyPage() {
  const theme = useTheme();

  const sections = [
    {
      title: "1. Recopilación de Información",
      content: "Recopilamos información que usted nos proporciona directamente cuando crea una cuenta, utiliza nuestros servicios o se comunica con nosotros. Esto puede incluir su nombre, dirección de correo electrónico y datos de uso de la plataforma."
    },
    {
      title: "2. Uso de la Información",
      content: "Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestros servicios, procesar transacciones, enviar notificaciones administrativas y responder a sus comentarios o preguntas."
    },
    {
      title: "3. Protección de Datos",
      content: "Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción accidental o ilícita."
    },
    {
      title: "4. Cookies y Tecnologías Similares",
      content: "Utilizamos cookies para mejorar su experiencia en nuestro sitio, analizar el tráfico y personalizar el contenido. Puede configurar su navegador para rechazar cookies, pero esto puede limitar algunas funcionalidades."
    },
    {
      title: "5. Cambios en la Política",
      content: "Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre cualquier cambio sustancial mediante un aviso en nuestra plataforma o por correo electrónico."
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />

      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 15 }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Box>
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" />} 
                sx={{ mb: 4, color: 'text.secondary' }}
              >
                <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Home</Typography>
                </Link>
                <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'primary.main' }}>Privacidad</Typography>
              </Breadcrumbs>

              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  letterSpacing: '-0.03em',
                  mb: 3,
                  lineHeight: 1.1
                }}
              >
                Política de Privacidad
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 8, fontWeight: 400, lineHeight: 1.6 }}>
                Tu privacidad es nuestra prioridad. En VTrading nos comprometemos a proteger tus datos personales y a ser transparentes sobre cómo los utilizamos.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {sections.map((section, index) => (
                  <Box key={index}>
                    <Typography variant="h5" fontWeight="800" sx={{ mb: 2, color: 'text.primary' }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {section.content}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Paper 
                elevation={0}
                sx={{ 
                  mt: 10, 
                  p: 4, 
                  borderRadius: 6, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontWeight: 500 }}>
                  Última actualización: 20 de enero de 2026. Si tienes dudas sobre nuestra política de privacidad, contáctanos en <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>privacidad@vtrading.com.ve</Box>
                </Typography>
              </Paper>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
