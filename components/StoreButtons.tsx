'use client';

import React from 'react';
import { Box, Button, Typography, alpha, useTheme, SxProps, Theme, BoxProps } from '@mui/material';
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';

interface StoreButtonsProps {
  onDownload?: (platform: string) => void;
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: BoxProps['justifyContent'];
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export default function StoreButtons({ 
  onDownload, 
  direction = 'row', 
  align = 'center', 
  justifyContent,
  fullWidth = false,
  sx 
}: StoreButtonsProps) {
  const theme = useTheme();

  const handleDownload = (platform: string) => {
    if (onDownload) {
      onDownload(platform);
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: direction, 
      flexWrap: 'wrap', 
      gap: 1.5, 
      alignItems: align,
      justifyContent: justifyContent || 'flex-start',
      ...sx 
    }}>
      <Button
        component="a"
        href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        variant="contained"
        fullWidth={fullWidth}
        onClick={() => handleDownload('android')}
        sx={{ 
          borderRadius: 2, 
          px: 2, 
          py: 1,
          bgcolor: 'text.primary',
          color: 'background.paper',
          textTransform: 'none',
          minHeight: 52,
          '&:hover': { bgcolor: 'text.secondary' },
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.2)',
          flex: direction === 'column' ? (fullWidth ? 'initial' : 1) : 'initial',
        }}
      >
        <AndroidIcon fontSize="large" />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DISPONIBLE EN
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.3px' }}>
            Google Play
          </Typography>
        </Box>
      </Button>

      <Button
        disabled
        variant="contained"
        fullWidth={fullWidth}
        sx={{ 
          borderRadius: 2, 
          px: 2, 
          py: 1,
          bgcolor: alpha(theme.palette.text.primary, 0.8), // Slightly lighter/transparent for disabled look
          color: 'background.paper',
          textTransform: 'none',
          minHeight: 52,
          opacity: 0.7, // Visual cue for disabled
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          flex: direction === 'column' ? (fullWidth ? 'initial' : 1) : 'initial',
        }}
      >
        <AppleIcon fontSize="large" />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
          <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500, opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            PRÓXIMAMENTE
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.3px' }}>
            App Store
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}
