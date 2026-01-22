'use client';

import React from 'react';
import { Box, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import TerminalIcon from '@mui/icons-material/Terminal';

const ManifestoSection = () => {
  const theme = useTheme();

  return (
    <Box id="desarrollador" sx={{ py: { xs: 10, md: 20 } }}>
      <Container maxWidth="lg">
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 4, sm: 6, md: 12 }, 
            borderRadius: { xs: 6, md: 10 }, 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center" sx={{ position: 'relative', zIndex: 2 }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h5" color="trendUp" fontWeight="800" gutterBottom sx={{ mb: 4, fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
                El Manifiesto
              </Typography>
              <Typography variant="h2" fontWeight="800" sx={{ mb: 6, lineHeight: 1.1, fontSize: { xs: '2rem', sm: '3rem', md: '4rem' }, letterSpacing: '-0.02em' }}>
                &quot;Cuando algo no te gusta, lo construyes mejor.&quot;
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 8, fontWeight: 400, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.25rem' } }}>
                VTrading no es solo una app; es una respuesta. Cansado de herramientas lentas y datos fragmentados, construí la plataforma que yo mismo, como trader, necesitaba. Velocidad sin concesiones, precisión sin dudas.
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
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: { xs: 'center', md: 'flex-end' },
                mt: { xs: 4, md: 0 }
              }}>
                <Box sx={{ 
                  display: 'inline-block', 
                  p: 0.5, 
                  borderRadius: 8, 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.trendUp} 100%)` 
                }}>
                  <Box sx={{ bgcolor: 'background.paper', p: { xs: 4, md: 6 }, borderRadius: 7.5, textAlign: 'center' }}>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 1, fontSize: { xs: '3rem', md: '4rem' } }}>99.9%</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.secondary' }}>
                      Uptime Guaranteed
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default ManifestoSection;
