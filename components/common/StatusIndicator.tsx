'use client';

import React from 'react';
import { Box, Typography, useTheme, Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

interface StatusIndicatorProps {
  label: string;
  status: 'healthy' | 'degraded' | 'error' | 'online' | 'offline';
  value?: string | number;
  compact?: boolean;
}

export function StatusIndicator({ label, status, value, compact = false }: StatusIndicatorProps) {
  const theme = useTheme();

  const statusConfig = {
    healthy: { color: theme.palette.success.main, label: 'Healthy' },
    degraded: { color: theme.palette.warning.main, label: 'Degraded' },
    error: { color: theme.palette.error.main, label: 'Error' },
    online: { color: theme.palette.success.main, label: 'Online' },
    offline: { color: theme.palette.error.main, label: 'Offline' },
  };

  const config = statusConfig[status];

  if (compact) {
    return (
      <Chip
        label={label}
        icon={<FiberManualRecordIcon sx={{ color: config.color, fontSize: '0.75rem' }} />}
        variant="outlined"
        size="small"
      />
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FiberManualRecordIcon
        sx={{
          fontSize: '0.75rem',
          color: config.color,
          animation: status === 'online' || status === 'healthy' ? 'none' : 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0.5 },
            '100%': { opacity: 1 },
          },
        }}
      />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: config.color, fontWeight: 600 }}>
          {config.label}
          {value && ` - ${value}`}
        </Typography>
      </Box>
    </Box>
  );
}
