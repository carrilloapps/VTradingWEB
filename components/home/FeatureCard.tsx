'use client';

import React from 'react';
import { Box, Grid, Paper, Typography, useTheme, alpha } from '@mui/material';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: string;
  xs?: number;
  sm?: number;
  md?: number;
}

const FeatureCard = ({ icon: Icon, title, description, color, xs = 12, sm = 6, md = 4 }: FeatureCardProps) => {
  const theme = useTheme();
  return (
    <Grid size={{ xs, sm, md }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          height: '100%',
          borderRadius: 6,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            borderColor: alpha(color || theme.palette.primary.main, 0.5),
            transform: 'translateY(-8px)',
            boxShadow: `0 20px 40px ${alpha(color || theme.palette.primary.main, 0.08)}`,
            '& .feature-icon': {
              transform: 'scale(1.1)',
              color: color
            }
          }
        }}
      >
        <Box 
          className="feature-icon"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: 64, 
            height: 64, 
            borderRadius: 4, 
            bgcolor: alpha(color || theme.palette.primary.main, 0.1), 
            color: color || theme.palette.primary.main,
            mb: 3,
            transition: 'all 0.3s ease'
          }}
        >
          <Icon sx={{ fontSize: 32 }} />
        </Box>
        
        <Typography variant="h5" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 3, flexGrow: 1 }}>
          {description}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 1, 
            px: 1.5, 
            py: 0.5, 
            borderRadius: 2, 
            bgcolor: alpha(theme.palette.text.primary, 0.03), 
            border: `1px solid ${theme.palette.divider}` 
          }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary' }}>
              Real-time Feed
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default FeatureCard;
