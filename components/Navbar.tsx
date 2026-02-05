'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  Container, 
  useTheme, 
  alpha, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  Avatar,
  Divider,
  Stack,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import Image from 'next/image';
import logo from '../app/assets/logotipo.png';
import flagVe from '../app/assets/flags/ve.svg';
import flagCo from '../app/assets/flags/co.svg';
import flagPe from '../app/assets/flags/pe.svg';
import ThemeToggle from './ThemeToggle';
import AuthModal from './AuthModal';
import DownloadAppButton from './DownloadAppButton';
import MarketTicker from './MarketTicker';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import md5 from 'md5';

const navItems = [
  { label: 'Aplicación', href: '/' },
  { label: 'Características', href: '/#caracteristicas' },
  { label: 'Planes de servicio', href: '/plan' },
];

const countries = [
  { id: 've', label: 'Venezuela', flag: flagVe, available: true },
  { id: 'co', label: 'Colombia', flag: flagCo, available: false },
  { id: 'pe', label: 'Perú', flag: flagPe, available: false },
];

export default function Navbar({ hideTicker }: { hideTicker?: boolean }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isTickerHidden, setIsTickerHidden] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=100`;
  };

  const handleCountryOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCountryAnchorEl(event.currentTarget);
  };

  const handleCountryClose = () => {
    setCountryAnchorEl(null);
  };

  const handleCountrySelect = (country: typeof countries[0]) => {
    if (country.available) {
      setSelectedCountry(country);
    }
    handleCountryClose();
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    handleCloseUserMenu();
    await signOut(auth);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        display: (isHome && !scrolled && isLargeScreen) ? 'none' : 'flex',
        bgcolor: scrolled ? alpha(theme.palette.background.default, 0.8) : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        zIndex: 1100, // Ensure it stays on top
      }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, md: 6, lg: 8, xl: 10 } }}>
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: { xs: 64, md: 90 }, py: { xs: 1, md: 2 } }}>
          {/* Logo */}
          <Box 
            component={Link} 
            href="/" 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.02)' }
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              width: { xs: 110, md: 150 }, 
              height: { xs: 28, md: 40 },
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
              transition: 'filter 0.3s ease'
            }}>
              <Image
                src={logo}
                alt="V-Trading Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  href={item.href}
                  sx={{ 
                    color: 'text.secondary', 
                    fontSize: '0.7rem', 
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    '&:hover': { color: 'text.primary', bgcolor: 'transparent' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                {/* Login Button / Profile */}
                {user ? (
                  <>
                    <Button
                      onClick={handleOpenUserMenu}
                      sx={{
                        p: 0.5,
                        borderRadius: '50px',
                        minWidth: 'auto',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        '&:hover': {
                          borderColor: theme.palette.primary.main,
                          bgcolor: alpha(theme.palette.primary.main, 0.05)
                        }
                      }}
                    >
                      <Avatar 
                        src={user.photoURL || (user.email ? getGravatarUrl(user.email) : '')}
                        sx={{ 
                          width: 32, 
                          height: 32,
                          bgcolor: 'primary.main',
                          fontSize: '0.9rem',
                          fontWeight: 700
                        }}
                      >
                        {user.displayName?.charAt(0) || user.email?.charAt(0)}
                      </Avatar>
                    </Button>
                    <Menu
                      anchorEl={anchorElUser}
                      open={Boolean(anchorElUser)}
                      onClose={handleCloseUserMenu}
                      disableScrollLock
                      elevation={8}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      PaperProps={{
                        sx: { 
                          mt: 1.5, 
                          minWidth: 200,
                          borderRadius: 3,
                          border: `1px solid ${theme.palette.divider}`,
                          bgcolor: 'background.paper'
                        }
                      }}
                    >
                      <MenuItem component={Link} href="/cuenta?tab=profile" onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Mi Perfil
                      </MenuItem>
                      <MenuItem component={Link} href="/cuenta?tab=security" onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <SecurityIcon fontSize="small" />
                        </ListItemIcon>
                        Seguridad
                      </MenuItem>
                      <MenuItem component={Link} href="/cuenta?tab=activity" onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <HistoryIcon fontSize="small" />
                        </ListItemIcon>
                        Actividad
                      </MenuItem>
                      <MenuItem component={Link} href="/cuenta?tab=settings" onClick={handleCloseUserMenu}>
                        <ListItemIcon>
                          <SettingsIcon fontSize="small" />
                        </ListItemIcon>
                        Ajustes
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Cerrar Sesión
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    onClick={() => setAuthModalOpen(true)}
                    variant="outlined"
                    size="small"
                    startIcon={<PersonIcon />}
                    sx={{
                      borderRadius: '50px',
                      px: 3,
                      textTransform: 'none',
                      fontWeight: 700,
                      borderColor: alpha(theme.palette.divider, 0.1),
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    Ingresar
                  </Button>
                )}
                <ThemeToggle />
                
                {/* Selector de Países */}
                <Button
                  onClick={handleCountryOpen}
                  endIcon={<KeyboardArrowDownIcon sx={{ 
                    transition: 'transform 0.2s',
                    transform: countryAnchorEl ? 'rotate(180deg)' : 'none',
                    fontSize: '1rem'
                  }} />}
                  sx={{ 
                    color: 'text.primary',
                    px: 1,
                    minWidth: 'auto',
                    borderRadius: 2,
                    '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.05) }
                  }}
                >
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                  }}>
                    <Image 
                      src={selectedCountry.flag} 
                      alt={selectedCountry.label}
                      width={24}
                      height={24}
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
                </Button>

                <Menu
                  anchorEl={countryAnchorEl}
                  open={Boolean(countryAnchorEl)}
                  onClose={handleCountryClose}
                  disableScrollLock
                  elevation={8}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{
                    sx: { 
                      mt: 1.5, 
                      minWidth: 160,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      bgcolor: 'background.paper'
                    }
                  }}
                >
                  {countries.map((country) => (
                    <MenuItem 
                      key={country.id} 
                      onClick={() => handleCountrySelect(country)}
                      disabled={!country.available}
                      sx={{ 
                        py: 1.5, 
                        px: 2,
                        gap: 2,
                        borderRadius: 1.5,
                        mx: 1,
                        my: 0.5,
                        '&.Mui-disabled': {
                          opacity: 0.6
                        }
                      }}
                    >
                      <Box sx={{ 
                        width: 24, 
                        height: 24, 
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                      }}>
                        <Image 
                          src={country.flag} 
                          alt={country.label}
                          width={24}
                          height={24}
                          style={{ objectFit: 'cover' }}
                        />
                      </Box>
                      <ListItemText 
                        primary={country.label} 
                        secondary={!country.available ? "Próximamente" : null}
                        primaryTypographyProps={{ 
                          fontWeight: selectedCountry.id === country.id ? 800 : 500,
                          fontSize: '0.9rem'
                        }}
                        secondaryTypographyProps={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: 'primary.main'
                        }}
                      />
                      {selectedCountry.id === country.id && (
                        <ListItemIcon sx={{ minWidth: 'auto', ml: 'auto' }}>
                          <CheckIcon color="primary" fontSize="small" />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ))}
                </Menu>

                <DownloadAppButton />
              </Box>
            </Box>
          )}

          {/* Mobile Menu Icon */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ThemeToggle />
              
              {/* Selector de Países (Mobile Compact) */}
              <IconButton 
                onClick={handleCountryOpen}
                sx={{ 
                  color: 'text.primary',
                  p: 1
                }}
              >
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <Image 
                    src={selectedCountry.flag} 
                    alt={selectedCountry.label}
                    width={24}
                    height={24}
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
              </IconButton>

              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>

      {!hideTicker && (
        <MarketTicker 
          hide={isTickerHidden} 
          onClose={() => setIsTickerHidden(true)} 
        />
      )}

      <AuthModal 
        open={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 300, bgcolor: 'background.default' }
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer Header */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box sx={{ position: 'relative', width: 100, height: 30 }}>
              <Image
                src={logo}
                alt="V-Trading"
                fill
                style={{ objectFit: 'contain', filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
              />
            </Box>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* User Section (Mobile) */}
          <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                  src={user.photoURL || (user.email ? getGravatarUrl(user.email) : '')}
                  sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                >
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                  <Typography variant="subtitle1" fontWeight={700} noWrap>
                    {user.displayName || 'Usuario'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {user.email}
                  </Typography>
                  <Button 
                    component={Link} 
                    href="/cuenta?tab=profile"
                    size="small" 
                    sx={{ mt: 0.5, p: 0, minWidth: 'auto', textTransform: 'none' }}
                    onClick={handleDrawerToggle}
                  >
                    Ver mi perfil
                  </Button>
                </Box>
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonIcon />}
                onClick={() => {
                  setAuthModalOpen(true);
                  handleDrawerToggle();
                }}
                sx={{ borderRadius: 2 }}
              >
                Iniciar Sesión / Registro
              </Button>
            )}
          </Box>

          {/* Navigation Links */}
          <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
            <Typography variant="overline" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
              Menú Principal
            </Typography>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  href={item.href} 
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 600 }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
            
            {user && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="overline" color="text.secondary" sx={{ px: 2, mb: 1, display: 'block' }}>
                  Mi Cuenta
                </Typography>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/cuenta?tab=security" onClick={handleDrawerToggle} sx={{ borderRadius: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><SecurityIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Seguridad" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/cuenta?tab=activity" onClick={handleDrawerToggle} sx={{ borderRadius: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><HistoryIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Actividad" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/cuenta?tab=settings" onClick={handleDrawerToggle} sx={{ borderRadius: 2 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><SettingsIcon fontSize="small" /></ListItemIcon>
                    <ListItemText primary="Ajustes" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText primary="Cerrar Sesión" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>

          {/* Footer / Socials */}
          <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
            <DownloadAppButton fullWidth sx={{ mb: 3 }} />
            
            <Stack direction="row" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
              <IconButton component="a" href="https://x.com/VTradingAPP" target="_blank" size="small">
                <XIcon fontSize="small" />
              </IconButton>
              <IconButton component="a" href="https://www.linkedin.com/company/vtradingapp" target="_blank" size="small">
                <LinkedInIcon fontSize="small" />
              </IconButton>
              <IconButton component="a" href="https://www.facebook.com/vtradingapp" target="_blank" size="small">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton component="a" href="https://www.instagram.com/vtradingapp/" target="_blank" size="small">
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Stack>
            
            <Typography variant="caption" align="center" display="block" color="text.secondary">
              © {new Date().getFullYear()} VTrading. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
