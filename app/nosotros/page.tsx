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
import TerminalIcon from '@mui/icons-material/Terminal';
import SpeedIcon from '@mui/icons-material/Speed';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SecurityIcon from '@mui/icons-material/Security';

export default function SobreNosotrosPage() {
  const theme = useTheme();

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      {/* HERO SECTION - Sincronizado con Home */}
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 15, position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
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
                  mb: 4
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.65rem' }}>
                  Nuestra Misión y Visión
                </Typography>
              </Box>
              
              <Typography 
                variant="h1" 
                fontWeight="800" 
                sx={{ 
                  fontSize: { xs: '2.5rem', md: '4.5rem' },
                  letterSpacing: '-0.03em',
                  mb: 4,
                  lineHeight: 1.1
                }}
              >
                Democratizando el acceso a la <Box component="span" sx={{ color: 'primary.main' }}>información financiera.</Box>
              </Typography>
              
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                VTrading nació de la necesidad de transparencia en un mercado fragmentado. Construimos puentes tecnológicos para que cada venezolano tenga datos precisos en la palma de su mano.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4}>
            {[
              { 
                icon: SpeedIcon, 
                title: "Velocidad Real", 
                desc: "Infraestructura diseñada para latencia mínima en la entrega de datos de mercado.",
                color: theme.palette.primary.main 
              },
              { 
                icon: PrecisionManufacturingIcon, 
                title: "Precisión Absoluta", 
                desc: "Algoritmos de verificación cruzada para garantizar la veracidad de cada cotización.",
                color: "#00FF94" 
              },
              { 
                icon: SecurityIcon, 
                title: "Transparencia Total", 
                desc: "Fuentes verificables y datos abiertos para una economía más justa.",
                color: "#9C27B0" 
              }
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 6,
                    bgcolor: alpha(theme.palette.background.paper, 0.5),
                    border: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      borderColor: alpha(feature.color, 0.3),
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 56, height: 56, borderRadius: 3, 
                    bgcolor: alpha(feature.color, 0.1), color: feature.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3
                  }}>
                    <feature.icon />
                  </Box>
                  <Typography variant="h5" fontWeight="800" gutterBottom>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.8}>{feature.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* HISTORIA SECTION */}
      <Box sx={{ py: 15, bgcolor: alpha(theme.palette.background.paper, 0.3) }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', mb: 2, display: 'block' }}>
                La Historia
              </Typography>
              <Typography variant="h3" fontWeight="800" sx={{ mb: 4, letterSpacing: '-0.02em' }}>
                Construido por traders, para traders.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                VTrading no comenzó en una oficina corporativa, sino en una terminal de trading. La frustración por la falta de datos centralizados y precisos en Venezuela nos llevó a crear nuestra propia solución.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.8 }}>
                Hoy, lo que empezó como un script personal se ha convertido en una plataforma robusta que sirve a miles de usuarios diariamente, manteniendo nuestro compromiso original con la integridad de los datos.
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default', border: `1px solid ${theme.palette.divider}` }}>
                  <TerminalIcon color="primary" />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight="800">José P. Carrillo</Typography>
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, color: 'text.secondary' }}>
                    CEO @ VTrading.app
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ 
                p: 0.5, 
                borderRadius: 10, 
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.trendUp} 100%)` 
              }}>
                <Box sx={{ bgcolor: 'background.paper', p: 6, borderRadius: 9.5, textAlign: 'center' }}>
                  <Typography variant="h1" fontWeight="900" sx={{ color: 'primary.main', mb: 1, fontSize: '5rem' }}>+10k</Typography>
                  <Typography variant="h6" fontWeight="800" sx={{ mb: 2 }}>Usuarios Activos</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confiando en nuestra data para tomar decisiones financieras críticas cada día.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
