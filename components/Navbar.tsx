'use client';

import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  Container, 
  Typography,
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
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckIcon from '@mui/icons-material/Check';
import Image from 'next/image';
import logo from '../app/assets/logotipo.png';
import flagVe from '../app/assets/flags/ve.svg';
import flagCo from '../app/assets/flags/co.svg';
import flagPe from '../app/assets/flags/pe.svg';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

const navItems = [
  { label: 'Mercados', href: '#mercados' },
  { label: 'Características', href: '#caracteristicas' },
  { label: 'Desarrollador', href: '#desarrollador' },
];

const countries = [
  { id: 've', label: 'Venezuela', flag: flagVe, available: true },
  { id: 'co', label: 'Colombia', flag: flagCo, available: false },
  { id: 'pe', label: 'Perú', flag: flagPe, available: false },
];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [countryAnchorEl, setCountryAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        bgcolor: scrolled ? alpha(theme.palette.background.default, 0.8) : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
        transition: 'all 0.3s ease-in-out',
        height: 80,
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
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
              width: { xs: 120, md: 150 }, 
              height: { xs: 32, md: 40 },
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

                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    borderRadius: 10, 
                    px: 3, 
                    fontSize: '0.7rem', 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Descargar App
                </Button>
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

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: 280, bgcolor: 'background.default' }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton 
                  href={item.href} 
                  onClick={handleDrawerToggle}
                  sx={{ borderRadius: 2, mb: 1 }}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ 
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }} 
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ mt: 4, borderRadius: 3, py: 1.5 }}
          >
            Descargar App
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
