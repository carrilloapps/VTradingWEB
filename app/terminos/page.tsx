'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  alpha,
  Paper,
  Fade
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TerminosPage() {
  const theme = useTheme();

  const sections = [
    {
      title: "1. Aceptación de los Términos",
      content: "Al acceder y utilizar VTrading, usted acepta cumplir y estar sujeto a los siguientes términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios."
    },
    {
      title: "2. Uso del Servicio",
      content: "VTrading proporciona información financiera en tiempo real con fines informativos únicamente. No somos asesores financieros y la información proporcionada no constituye asesoramiento de inversión, financiero o comercial."
    },
    {
      title: "3. Precisión de los Datos",
      content: "Aunque nos esforzamos por garantizar que todos los datos sean precisos y se actualicen en tiempo real, VTrading no garantiza la exactitud, integridad o puntualidad de la información proporcionada. No nos hacemos responsables de las decisiones tomadas basadas en estos datos."
    },
    {
      title: "4. Propiedad Intelectual",
      content: "Todo el contenido, marcas comerciales, logotipos y software utilizado en VTrading son propiedad de sus respectivos dueños y están protegidos por las leyes de propiedad intelectual."
    },
    {
      title: "5. Limitación de Responsabilidad",
      content: "En ningún caso VTrading será responsable por cualquier pérdida o daño, incluyendo sin limitación, pérdidas financieras resultantes del uso de esta plataforma."
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 10 }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ mb: 8 }}>
              <Box 
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 1.5, 
                  px: 2, 
                  py: 0.8, 
                  borderRadius: 2, 
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  mb: 3
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.65rem' }}>
                  Legal & Compliance
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  letterSpacing: '-0.03em',
                  mb: 2,
                  lineHeight: 1.1
                }}
              >
                Términos y Condiciones
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 650, fontWeight: 400, lineHeight: 1.6 }}>
                Reglas y lineamientos para el uso de nuestra plataforma de inteligencia financiera.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {sections.map((section, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 5 },
                    borderRadius: 6,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.04)}`
                    }
                  }}
                >
                  <Typography variant="h5" fontWeight="800" sx={{ mb: 3, color: 'text.primary' }}>
                    {section.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {section.content}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              Última actualización: 20 de enero de 2026
            </Typography>
          </Box>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
