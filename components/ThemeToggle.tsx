'use client';

import React from 'react';
import { IconButton, useTheme, Box, Tooltip } from '@mui/material';
import { Brightness4 as DarkIcon, Brightness7 as LightIcon } from '@mui/icons-material';
import { useColorMode } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const theme = useTheme();
  const colorMode = useColorMode();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        color: 'text.primary',
        borderRadius: 1,
        p: 1,
      }}
    >
      <Tooltip title={`Cambiar a modo ${theme.palette.mode === 'dark' ? 'claro' : 'oscuro'}`}>
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <LightIcon /> : <DarkIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
