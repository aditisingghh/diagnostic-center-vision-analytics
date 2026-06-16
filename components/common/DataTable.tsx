'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  useTheme,
  alpha,
} from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string | React.ReactNode;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  rows: any[];
  rowsPerPage?: number;
  maxHeight?: string | number;
}

export function DataTable({ columns, rows, rowsPerPage = 10, maxHeight = 500 }: DataTableProps) {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPageState, setRowsPerPageState] = useState(rowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPageState(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = rows.slice(page * rowsPerPageState, page * rowsPerPageState + rowsPerPageState);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight,
        backgroundColor: 'background.paper',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  fontWeight: 600,
                  color: 'text.primary',
                  width: column.width,
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedRows.map((row, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                },
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.format ? column.format(row[column.id]) : row[column.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPageState}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
