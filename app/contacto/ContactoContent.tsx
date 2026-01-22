'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  alpha,
  Paper,
  TextField,
  Button,
  Fade,
  Stack
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import flagVe from '@/app/assets/flags/ve.svg';
import Image from 'next/image';

export default function ContactoPage() {
  const theme = useTheme();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flexGrow: 1,
          pt: { xs: 16, md: 12 }, 
          pb: { xs: 8, md: 8 },
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.08)} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, lg: 5 }}>
              <Fade in timeout={1000}>
                <Box>
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
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary', fontSize: '0.875rem' }}>
                      Estamos en línea
                    </Typography>
                  </Box>

                  <Typography 
                    variant="h2" 
                    fontWeight="800" 
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                      mb: 4, 
                      letterSpacing: '-0.02em', 
                      lineHeight: 1.1 
                    }}
                  >
                    Hablemos de <Box component="span" sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>finanzas en</Box> <Box 
                      component="span" 
                      sx={{ 
                        display: 'inline-block',
                        verticalAlign: 'middle',
                        position: 'relative',
                        width: { xs: 40, md: 56 },
                        height: { xs: 40, md: 56 },
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.1)}`,
                        ml: 1
                      }}
                    >
                      <Image 
                        src={flagVe} 
                        alt="Venezuela" 
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  </Typography>
                  
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 6, lineHeight: 1.6, fontWeight: 400 }}>
                    ¿Tienes dudas sobre nuestra API, necesitas soporte personalizado o quieres colaborar con nosotros? Nuestro equipo está listo para ayudarte.
                  </Typography>

                  <Stack spacing={4}>
                    {[
                      { icon: EmailIcon, title: 'Correo electrónico', detail: 'soporte@vtrading.app' },
                      { icon: EmailIcon, title: 'Correo electrónico', detail: 'info@vtrading.app' },
                      { icon: LocationOnIcon, title: 'Oficina', detail: 'Caracas, Venezuela' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: 3, 
                          bgcolor: alpha(theme.palette.primary.main, 0.1), 
                          color: 'primary.main',
                          display: 'flex'
                        }}>
                          <item.icon />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 800, color: 'text.secondary', letterSpacing: '0.1em' }}>
                            {item.title}
                          </Typography>
                          <Typography variant="body1" fontWeight="700">
                            {item.detail}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Fade>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
              <Fade in timeout={1500}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: { xs: 4, md: 6 }, 
                    borderRadius: 6, 
                    border: `1px solid ${theme.palette.divider}`, 
                    bgcolor: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Nombre" 
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Correo Electrónico" 
                          type="email" 
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField 
                          fullWidth 
                          label="Asunto" 
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField 
                          fullWidth 
                          label="Mensaje" 
                          multiline 
                          rows={4} 
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Button 
                          type="submit"
                          variant="contained" 
                          size="large" 
                          fullWidth
                          disabled={isSending}
                          startIcon={<SendIcon />}
                          sx={{ 
                            py: 2, 
                            borderRadius: 3, 
                            fontWeight: 800, 
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                          }}
                        >
                          {isSending ? 'Enviando...' : 'Enviar Mensaje'}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
