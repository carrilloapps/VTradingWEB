'use client';

import { Box, Container, Grid, Typography, Fade, useTheme, alpha } from '@mui/material';
import PhoneMockup from './PhoneMockup';
import StoreButtons from '../StoreButtons';
import HeroHeader from './HeroHeader';
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
        minHeight: '100vh',
        pt: { xs: 12, md: 0 },
        pb: { xs: 8, md: 0 },
        display: 'flex',
        flexDirection: 'column', // Ensure vertical stacking to prevent horizontal deformation
        justifyContent: 'center', // Vertically center content
        position: 'relative',
        overflow: 'hidden',
        // Increased opacity from 0.05 to 0.08 for better visibility
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6, lg: 8, xl: 10 }, width: '100%' }}>
        <Grid container spacing={6} alignItems="center">
          {/* Visual Phone Mockup - Moved to Left */}
          <Grid size={{ xs: 12, lg: 'auto' }} sx={{ display: { xs: 'none', lg: 'flex' }, justifyContent: 'flex-start' }}>
            <PhoneMockup marketData={marketData} loading={loading} />
          </Grid>

          {/* Text Content - Moved to Right */}
          <Grid size={{ xs: 12, lg: 'grow' }} sx={{ textAlign: { xs: 'center', lg: 'left' }, minWidth: 0 }}> {/* minWidth 0 for flex items to shrink properly if needed */}
            {/* Desktop Hero Header */}
            <Box sx={{ display: { xs: 'none', lg: 'block' }, width: '100%', mb: 4, overflowX: 'visible' }}> {/* Ensure no clipping */}
              <HeroHeader />
            </Box>

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
                    mb: { xs: 3, md: 4 },
                    maxWidth: '100%',
                  }}
                >
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main', animation: 'pulse 2s infinite', flexShrink: 0 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', fontSize: { xs: '0.65rem', md: '0.875rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Lo último en tecnología a tu alcance
                  </Typography>
                </Box>
                
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2rem', sm: '3.5rem', md: '5rem' }, 
                    fontWeight: 800, 
                    lineHeight: { xs: 1.1, md: 1.2 },
                    mb: { xs: 3, md: 4 },
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

                <Typography variant="h6" color="text.secondary" sx={{ mb: { xs: 4, md: 6 }, maxWidth: 800, fontWeight: 400, lineHeight: 1.6, fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
                  Precisión absoluta en tiempo real. Bolsa de Valores de Caracas, Banco Central de Venezuela, Mercado P2P y divisas en una sola interfaz diseñada para la máxima eficiencia.
                </Typography>

                <StoreButtons 
                  onDownload={onDownload}
                  justifyContent={{ xs: 'center', lg: 'flex-start' }}
                />
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
