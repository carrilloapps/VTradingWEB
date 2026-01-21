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
  Button,
  TextField,
  Fade,
  Stack
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import Link from 'next/link';

export default function SoportePage() {
  const theme = useTheme();

  const supportOptions = [
    {
      icon: HeadsetMicIcon,
      title: 'Atención al Cliente',
      description: 'Nuestro equipo está disponible para ayudarte con cualquier problema técnico o duda sobre la plataforma.',
      action: 'Contactar Soporte',
      href: '/contacto',
      color: theme.palette.primary.main
    },
    {
      icon: HelpOutlineIcon,
      title: 'Centro de Ayuda',
      description: 'Consulta nuestra base de conocimientos con preguntas frecuentes y guías detalladas.',
      action: 'Ir al Centro de Ayuda',
      href: '#',
      color: '#00FF94'
    },
    {
      icon: DescriptionIcon,
      title: 'Documentación API',
      description: 'Recursos técnicos detallados para desarrolladores que deseen integrar nuestros datos.',
      action: 'Ver Documentación',
      href: '#',
      color: '#9C27B0'
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 10 }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ mb: 8, textAlign: 'center' }}>
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
                  ¿Cómo podemos ayudarte?
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
                Centro de Soporte
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
                Encuentra respuestas rápidas, contacta con nuestro equipo técnico o explora nuestra documentación.
              </Typography>
            </Box>
          </Fade>

          <Grid container spacing={4} sx={{ mb: 12 }}>
            {supportOptions.map((option, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    height: '100%',
                    borderRadius: 6,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: alpha(option.color, 0.5),
                      transform: 'translateY(-8px)',
                      boxShadow: `0 20px 40px ${alpha(option.color, 0.08)}`,
                    }
                  }}
                >
                  <Box sx={{ 
                    width: 56, 
                    height: 56, 
                    borderRadius: 3, 
                    bgcolor: alpha(option.color, 0.1), 
                    color: option.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                  }}>
                    <option.icon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h5" fontWeight="800" gutterBottom>
                    {option.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7, flexGrow: 1 }}>
                    {option.description}
                  </Typography>
                  <Button 
                    component={Link}
                    href={option.href}
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      fontWeight: 700,
                      borderColor: alpha(theme.palette.divider, 0.1),
                      '&:hover': {
                        borderColor: option.color,
                        bgcolor: alpha(option.color, 0.05)
                      }
                    }}
                  >
                    {option.action}
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Search/FAQ Section */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 8,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${theme.palette.divider}`,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="800" sx={{ mb: 2 }}>
              ¿No encuentras lo que buscas?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}>
              Escríbenos directamente y uno de nuestros especialistas financieros te atenderá a la brevedad posible.
            </Typography>
            <Button
              component={Link}
              href="/contacto"
              variant="contained"
              size="large"
              sx={{
                borderRadius: 4,
                px: 6,
                py: 2,
                fontWeight: 800,
                textTransform: 'none',
                boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              Abrir un Ticket de Soporte
            </Button>
          </Paper>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
