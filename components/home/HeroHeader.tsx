'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  useTheme, 
  alpha, 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import md5 from 'md5';

import logo from '../../app/assets/logotipo.png';
import flagVe from '../../app/assets/flags/ve.svg';
import flagCo from '../../app/assets/flags/co.svg';
import flagPe from '../../app/assets/flags/pe.svg';
import AuthModal from '../AuthModal';
import ThemeToggle from '../ThemeToggle';
import MarketTicker from '../MarketTicker';
import DownloadAppButton from '../DownloadAppButton';

const navItems = [
  { label: 'Aplicación', href: '/' },
  { label: 'Características', href: '/#caracteristicas' },
  { label: 'Desarrollador', href: '/#desarrollador' },
];

const countries = [
  { id: 've', label: 'Venezuela', flag: flagVe, available: true },
  { id: 'co', label: 'Colombia', flag: flagCo, available: false },
  { id: 'pe', label: 'Perú', flag: flagPe, available: false },
];

export default function HeroHeader() {
  const theme = useTheme();
  const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isTickerHidden, setIsTickerHidden] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        width: '100%', 
        minHeight: { xs: 64, md: 90 },
        py: { xs: 1, md: 2 }
      }}>
        {/* 1. Left: Logo */}
        <Box 
          component={Link} 
          href="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
            mr: 4
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

        {/* 2. Center: Nav Items (Visible on lg+) */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 4, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}>
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
        </Box>

        {/* 3. Right: Tools (User, Settings, Flag, Button) - Visible on lg+ */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1, alignItems: 'center', flexShrink: 0 }}>
          
          {/* User Profile / Login */}
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

          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Country Selector */}
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

          {/* Action Button */}
          <DownloadAppButton sx={{ whiteSpace: 'nowrap', flexShrink: 0 }} />
        </Box>

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

        <AuthModal 
          open={authModalOpen} 
          onClose={() => setAuthModalOpen(false)} 
        />
      </Box>

      {/* Market Ticker */}
      {!isTickerHidden && (
        <MarketTicker 
          hide={isTickerHidden} 
          onClose={() => setIsTickerHidden(true)}
          fadeEdges 
        />
      )}
    </Box>
  );
}
