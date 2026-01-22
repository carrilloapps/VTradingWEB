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
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Link as MuiLink,
  SelectChangeEvent
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';

import flagVe from '@/app/assets/flags/ve.svg';
import Image from 'next/image';
import Link from 'next/link';

export default function ContactoPage() {
  const theme = useTheme();
  const [isSending, setIsSending] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    privacyAccepted: false
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      privacyAccepted: e.target.checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacyAccepted) return;
    
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setOpenSnackbar(true);
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        privacyAccepted: false
      });
    }, 2000);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Box 
        sx={{ 
          flexGrow: 1,
          pt: { xs: 20, md: 24 }, 
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
            {/* Left Side: Info */}
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
                    }}>negocios en</Box> <Box 
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
                    ¿Interesado en nuestras licencias de datos, integraciones API o soporte empresarial? 
                    Nuestro equipo especializado está listo para brindarte la mejor solución.
                  </Typography>

                  <Stack spacing={4}>
                    {[
                      { icon: EmailIcon, title: 'Ventas y Licencias', detail: 'ventas@vtrading.app' },
                      { icon: BusinessIcon, title: 'Soporte Corporativo', detail: 'soporte@vtrading.app' },
                      { icon: PhoneIcon, title: 'Atención Telefónica', detail: '+58 (212) 555-0199' },
                      { icon: LocationOnIcon, title: 'Oficina Central', detail: 'Caracas, Venezuela' }
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

            {/* Right Side: Form */}
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
                      
                      {/* Nombre y Apellido */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Nombre Completo" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>

                      {/* Empresa (Opcional) */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Empresa / Organización" 
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          variant="outlined" 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>

                      {/* Email */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Correo Electrónico" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          type="email" 
                          variant="outlined" 
                          required 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>

                      {/* Teléfono */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField 
                          fullWidth 
                          label="Teléfono de Contacto" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          type="tel"
                          variant="outlined" 
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>

                      {/* Asunto (Select) */}
                      <Grid size={{ xs: 12 }}>
                        <FormControl fullWidth required>
                          <InputLabel id="subject-label">Asunto / Departamento</InputLabel>
                          <Select
                            labelId="subject-label"
                            label="Asunto / Departamento"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            sx={{ borderRadius: 3 }}
                          >
                            <MenuItem value="ventas">Ventas y Licencias de Datos</MenuItem>
                            <MenuItem value="soporte">Soporte Técnico API</MenuItem>
                            <MenuItem value="facturacion">Facturación y Pagos</MenuItem>
                            <MenuItem value="alianzas">Alianzas Comerciales</MenuItem>
                            <MenuItem value="otros">Otros Consultas</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>

                      {/* Mensaje */}
                      <Grid size={{ xs: 12 }}>
                        <TextField 
                          fullWidth 
                          label="Detalle de su solicitud" 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          multiline 
                          rows={5} 
                          variant="outlined" 
                          required 
                          placeholder="Por favor describa sus requerimientos, volumen de datos esperado o cualquier duda técnica..."
                          InputProps={{ sx: { borderRadius: 3 } }}
                        />
                      </Grid>

                      {/* Privacidad */}
                      <Grid size={{ xs: 12 }}>
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={formData.privacyAccepted}
                              onChange={handleCheckboxChange}
                              color="primary" 
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              He leído y acepto la <Link href="/privacidad" passHref legacyBehavior><MuiLink underline="hover" color="primary">Política de Privacidad</MuiLink></Link> y el procesamiento de mis datos.
                            </Typography>
                          }
                        />
                      </Grid>

                      {/* Botón de Envío */}
                      <Grid size={{ xs: 12 }}>
                        <Button 
                          type="submit"
                          variant="contained" 
                          size="large" 
                          fullWidth
                          disabled={isSending || !formData.privacyAccepted}
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
                          {isSending ? 'Enviando Solicitud...' : 'Enviar Mensaje'}
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
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
          Mensaje enviado correctamente. Nuestro equipo le contactará pronto.
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
}
