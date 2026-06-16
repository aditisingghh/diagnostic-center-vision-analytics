'use client';

import React from 'react';
import { Card, CardContent, CardHeader, Box, CircularProgress, Typography, useTheme } from '@mui/material';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
  height?: string | number;
  actions?: React.ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  loading = false,
  error,
  children,
  height = 400,
  actions,
}: ChartContainerProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardHeader
        title={title}
        subheader={subtitle}
        action={actions}
        sx={{
          pb: 1,
          '& .MuiCardHeader-action': {
            mt: 0,
            mr: 0,
          },
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: height,
          position: 'relative',
          p: 2,
        }}
      >
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box sx={{ textAlign: 'center', color: 'error.main' }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        {!loading && !error && (
          <Box sx={{ width: '100%', height: '100%' }}>
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
