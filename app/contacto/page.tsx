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
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ContactoPage() {
  const theme = useTheme();
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => setIsSending(false), 2000);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <Navbar />
      
      <Box sx={{ pt: { xs: 20, md: 25 }, pb: 15 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8}>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', mb: 2, display: 'block' }}>
                    Contacto
                  </Typography>
                  <Typography variant="h2" fontWeight="800" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, mb: 4, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    Hablemos de tu <Box component="span" color="primary.main">futuro financiero.</Box>
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 6, lineHeight: 1.8 }}>
                    ¿Tienes dudas sobre nuestra API, necesitas soporte personalizado o quieres colaborar con nosotros? Nuestro equipo está listo para ayudarte.
                  </Typography>

                  <Stack spacing={4}>
                    {[
                      { icon: EmailIcon, title: 'Email', detail: 'soporte@vtrading.com.ve' },
                      { icon: PhoneIcon, title: 'WhatsApp', detail: '+58 (412) 000-0000' },
                      { icon: LocationOnIcon, title: 'Oficina', detail: 'Caracas, Venezuela' }
                    ].map((item, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main' }}>
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
                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Nombre" variant="outlined" required />
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField fullWidth label="Correo Electrónico" type="email" variant="outlined" required />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Asunto" variant="outlined" required />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Mensaje" multiline rows={4} variant="outlined" required />
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
                            fontSize: '1rem'
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
