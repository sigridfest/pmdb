import React from 'react';
import { Table, TableHead, TableRow, TableCell } from '@mui/material';
import { Column } from '../types';

interface HeaderProps {
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (columnId: string) => void;
}

export const PokemonTableHeader: React.FC<HeaderProps> = ({
  columns,
  onToggleColumn,
}) => {
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 2, backgroundColor: '#f5f5f5',}}>

      <Table>

        <TableHead>

          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                style={{width: column.width, fontFamily: 'Gill Sans', padding: '8px', cursor: column.hideable ? 'pointer' : 'default', textAlign: 'center', backgroundColor: '#f5f5f5',}}
                onClick={() => onToggleColumn(column.id)}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>

        </TableHead>

      </Table>
      
    </div>
  );
};
