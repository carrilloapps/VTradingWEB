'use client';

import React from 'react';
import { Box, Container, Grid, Typography, useTheme, alpha } from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import LanguageIcon from '@mui/icons-material/Language';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const theme = useTheme();

  return (
    <Box id="caracteristicas" sx={{ py: 20, bgcolor: alpha(theme.palette.background.paper, 0.3) }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 10 }}>
          <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', mb: 2, display: 'block' }}>
            Arquitectura de Datos
          </Typography>
          <Typography variant="h3" fontWeight="800" sx={{ mb: 3 }}>
            Omnipresencia de Mercado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
            Infraestructura conectada a las fuentes más críticas para garantizar transparencia y velocidad en cada decimal.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <FeatureCard 
            xs={12}
            md={8}
            icon={AnalyticsIcon}
            title="Bolsa de Valores de Caracas"
            description="Acceso directo a la API de la Bolsa. Monitorización de acciones, bonos de deuda privada y el Índice Bursátil Caracas (IBC) actualizado cada sesión con datos oficiales y análisis técnico integrado."
            color={theme.palette.trendUp}
          />
          <FeatureCard 
            xs={12}
            md={4}
            icon={AccountBalanceIcon}
            title="BCV & Bancos"
            description="Tasas oficiales y mesas de cambio de las principales entidades bancarias nacionales con actualización instantánea."
            color={theme.palette.primary.main}
          />
          <FeatureCard 
            xs={12}
            sm={6}
            md={6}
            icon={CurrencyBitcoinIcon}
            title="Crypto P2P Marketplace"
            description="Cálculo en tiempo real de Tether (USDT) vs VES basado en el volumen real de transacciones P2P de los exchanges más importantes."
            color={theme.palette.trendUp}
          />
          <FeatureCard 
            xs={12}
            sm={6}
            md={6}
            icon={LanguageIcon}
            title="P2P Border Cross"
            description="Cotizaciones cruzadas para operaciones fronterizas (COP, PEN, BRL, ARS) con tasas ajustadas a la realidad local."
            color="#9C27B0"
          />
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
