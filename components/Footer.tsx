'use client';

import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  useTheme,
  Divider,
  IconButton
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TerminalIcon from '@mui/icons-material/Terminal';
import Image from 'next/image';
import logo from '../app/assets/logotipo.png';
import Link from 'next/link';

export default function Footer() {
  const theme = useTheme();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'background.default', 
        pt: 10, 
        pb: 6, 
        borderTop: `1px solid ${theme.palette.divider}` 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8} sx={{ mb: 8 }}>
          {/* Brand and Description */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box 
              component={Link}
              href="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                textDecoration: 'none',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <Box sx={{ 
                position: 'relative', 
                width: 150, 
                height: 40,
                filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                transition: 'filter 0.3s ease'
              }}>
                <Image
                  src={logo}
                  alt="V-Trading Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8, maxWidth: 320 }}>
              Liderando la democratización de datos financieros en Venezuela. 
              Construyendo infraestructura para un futuro más transparente.
            </Typography>
          </Grid>

          {/* Product Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.primary', mb: 3, display: 'block' }}>
              Producto
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/mercados" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Mercados
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="#" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    API Docs
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                 <Link href="/soporte" style={{ textDecoration: 'none' }}>
                   <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                     Comunidad
                   </Typography>
                 </Link>
               </Box>
               <Box component="li" sx={{ mb: 1.5 }}>
                 <Link href="/estado" style={{ textDecoration: 'none' }}>
                   <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                     Estado del Sistema
                   </Typography>
                 </Link>
               </Box>
            </Box>
          </Grid>

          {/* Company Links */}
          <Grid size={{ xs: 6, md: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'text.primary', mb: 3, display: 'block' }}>
              Empresa
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/sobre-nosotros" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Sobre nosotros
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/privacidad" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Privacidad
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/soporte" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Soporte
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/terminos" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Términos
                  </Typography>
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1.5 }}>
                <Link href="/contacto" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                    Contacto
                  </Typography>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4, opacity: 0.5 }} />

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            © {new Date().getFullYear()} VTrading. Build with precision in Venezuela.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <EmailIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <TerminalIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
