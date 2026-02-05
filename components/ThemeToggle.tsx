'use client';

import React from 'react';
import { IconButton, useTheme, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useColorMode } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <Tooltip title={`Cambiar a modo ${theme.palette.mode === 'dark' ? 'claro' : 'oscuro'}`}>
      <IconButton
        onClick={colorMode.toggleColorMode}
        color="inherit"
        sx={{
          bgcolor: 'background.default',
          color: 'text.primary',
          p: 1,
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        {theme.palette.mode === 'dark' ? <LightIcon /> : <DarkIcon />}
      </IconButton>
    </Tooltip>
  );
}
