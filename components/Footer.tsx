'use client';

import { 
  Box, 
  Container, 
  Typography, 
  useTheme,
  Divider,
  IconButton,
  Stack,
  alpha,
  Grid
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import Image from 'next/image';
import logo from '../app/assets/logotipo.png';
import Link from 'next/link';
import StoreButtons from './StoreButtons';

const footerLinks = {
  product: [
    { label: 'Aplicación', href: '/' },
    { label: 'Características', href: '/#caracteristicas' },
    { label: 'API de servicios', href: '#' }, // TODO: Update with real link
    { label: 'Estado del sistema', href: '/estado' },
  ],
  company: [
    { label: 'Sobre nosotros', href: '/nosotros' },
    { label: 'Blog', href: '#' },
    { label: 'Carreras', href: '#' },
    { label: 'Contacto', href: '/contacto' },
  ],
  legal: [
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Términos', href: '/terminos' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Licencias', href: '/licencias' },
  ]
};

const socialLinks = [
  { icon: <XIcon fontSize="small" />, href: 'https://x.com/vtrading', label: 'X (Twitter)' },
  { icon: <LinkedInIcon fontSize="small" />, href: 'https://linkedin.com/company/vtrading', label: 'LinkedIn' },
  { icon: <FacebookIcon fontSize="small" />, href: 'https://www.facebook.com/vtradingapp', label: 'Facebook' },
  { icon: <InstagramIcon fontSize="small" />, href: 'https://www.instagram.com/vtradingapp/', label: 'Instagram' },
];

export default function Footer() {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.paper', // Slightly distinct from default background
        pt: { xs: 8, md: 10 }, 
        pb: { xs: 6, md: 6 }, 
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient overlay */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(theme.palette.primary.main, 0.5)} 50%, ${alpha(theme.palette.primary.main, 0)} 100%)`,
        opacity: 0.5
      }} />

      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 6, md: 4, lg: 8 }}>
          
          {/* 1. Brand & Description */}
          <Grid size={{ xs: 12, md: 4, lg: 5 }}>
            <Box sx={{ maxWidth: 360 }}>
              <Box 
                component={Link}
                href="/"
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  mb: 3,
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <Box sx={{ 
                  position: 'relative', 
                  width: 160, 
                  height: 42,
                  filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                }}>
                  <Image
                    src={logo}
                    alt="V-Trading"
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'left center' }}
                  />
                </Box>
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
                Democratizando el acceso a datos financieros en Venezuela. 
                Infraestructura robusta para un mercado transparente y eficiente.
              </Typography>

              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <IconButton 
                    key={social.label}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    size="small"
                    sx={{ 
                      color: 'text.secondary',
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      transition: 'all 0.2s',
                      '&:hover': { 
                        color: 'primary.main', 
                        borderColor: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* 2. Links Columns */}
          <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
              PRODUCTO
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.product.map((link) => (
                <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main' } 
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, sm: 4, md: 2, lg: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
              EMPRESA
            </Typography>
            <Stack spacing={1.5}>
              {footerLinks.company.map((link) => (
                <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary', 
                      transition: 'color 0.2s',
                      '&:hover': { color: 'primary.main' } 
                    }}
                  >
                    {link.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* 3. Download / CTA */}
          <Grid size={{ xs: 12, sm: 4, md: 4, lg: 3 }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: alpha(theme.palette.background.default, 0.5), 
              borderRadius: 3, 
              border: `1px solid ${theme.palette.divider}` 
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                Descarga la App
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, lineHeight: 1.5 }}>
                Accede a los mercados en tiempo real desde tu dispositivo móvil.
              </Typography>
              <StoreButtons direction="column" fullWidth />
            </Box>
          </Grid>

        </Grid>

        <Divider sx={{ my: 6, opacity: 0.5 }} />

        {/* Bottom Bar */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          alignItems: { xs: 'center', md: 'center' }, 
          justifyContent: 'space-between', 
          gap: 3 
        }}>
          <Typography variant="caption" color="text.secondary">
            © {new Date().getFullYear()} VTrading
          </Typography>

          <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
            {footerLinks.legal.map((link) => (
              <Link key={link.label} href={link.href} style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary', 
                    '&:hover': { color: 'text.primary', textDecoration: 'underline' } 
                  }}
                >
                  {link.label}
                </Typography>
              </Link>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
