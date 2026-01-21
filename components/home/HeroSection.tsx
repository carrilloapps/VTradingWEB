'use client';

import React from 'react';
import { Box, Container, Grid, Typography, Button, Fade, useTheme, alpha } from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import PhoneMockup from './PhoneMockup';
import { RatesResponse } from '@/lib/vtrading-types';

interface HeroSectionProps {
  marketData: RatesResponse | null;
  loading: boolean;
  onDownload: (platform: string) => void;
}

const HeroSection = ({ marketData, loading, onDownload }: HeroSectionProps) => {
  const theme = useTheme();

  return (
    <Box 
      component="section" 
      sx={{ 
        pt: { xs: 15, md: 18 }, 
        pb: 10, 
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.05)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 3, md: 6, lg: 8, xl: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Visual Phone Mockup - Moved to Left */}
          <Grid size={{ xs: 12, lg: 'auto' }} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'flex-start' }}>
            <PhoneMockup marketData={marketData} loading={loading} />
          </Grid>

          {/* Text Content - Moved to Right */}
          <Grid size={{ xs: 12, lg: 'grow' }} sx={{ textAlign: { xs: 'center', lg: 'left' } }}>
            <Fade in timeout={1000}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', lg: 'flex-start' } }}>
                <Box 
                  sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    px: 2, 
                    py: 1, 
                    borderRadius: 2, 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    mb: 4
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.875rem' }}>
                    Lo último en tecnología a tu alcance
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' }, 
                    fontWeight: 800, 
                    lineHeight: 1.2,
                    mb: 4,
                    letterSpacing: '-0.03em'
                  }}
                >
                  El monitor financiero<Box component="span" sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.trendUp} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block', // Prevent clipping
                  }}> que Venezuela necesitaba.</Box>
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: 800, fontWeight: 400, lineHeight: 1.6, fontSize: '1.25rem' }}>
                  Precisión absoluta en tiempo real. Bolsa de Valores de Caracas, Banco Central de Venezuela, Mercado P2P y divisas en una sola interfaz diseñada para la máxima eficiencia.
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: { xs: 'center', lg: 'flex-start' } }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<AndroidIcon />}
                    onClick={() => onDownload('android')}
                    sx={{ 
                      borderRadius: 4, 
                      px: { xs: 3, md: 4 }, 
                      py: 1.5, 
                      borderWidth: 2,
                      '&:hover': { borderWidth: 2 },
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      minHeight: 48 // Touch target
                    }}
                  >
                    Play Store
                  </Button>
                  <Button
                    disabled
                    variant="outlined"
                    size="large"
                    startIcon={<AppleIcon />}
                    sx={{ 
                      borderRadius: 4, 
                      px: { xs: 3, md: 4 }, 
                      py: 1.5, 
                      textTransform: 'none',
                      fontWeight: 700,
                      opacity: 0.6, // Increased visibility even if disabled
                      fontSize: '1rem',
                      minHeight: 48
                    }}
                  >
                    Próximamente iOS
                  </Button>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
