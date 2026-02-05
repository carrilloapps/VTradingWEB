'use client';

import React from 'react';
import { Button, ButtonProps, useTheme, alpha } from '@mui/material';
import GetAppIcon from '@mui/icons-material/GetApp';

interface DownloadAppButtonProps extends ButtonProps {
  fullWidth?: boolean;
}

export default function DownloadAppButton({ sx, ...props }: DownloadAppButtonProps) {
  const theme = useTheme();

  return (
    <Button
      component="a"
      href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL}
      target="_blank"
      rel="noopener noreferrer"
      variant="contained"
      startIcon={<GetAppIcon />}
      sx={{
        borderRadius: '50px',
        // Gradient background for professional look
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        boxShadow: `0 4px 14px 0 ${alpha(theme.palette.primary.main, 0.35)}`,
        textTransform: 'none',
        fontSize: '0.9rem',
        fontWeight: 700,
        py: 1,
        px: 3,
        letterSpacing: '0.02em',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        minHeight: 44,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 6px 20px 0 ${alpha(theme.palette.primary.main, 0.5)}`,
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: `0 2px 10px 0 ${alpha(theme.palette.primary.main, 0.3)}`,
        },
        ...sx,
      }}
      {...props}
    >
      Descargar App
    </Button>
  );
}
