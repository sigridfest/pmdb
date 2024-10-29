import React from 'react';
import { TableBody } from '@mui/material';
import { Pokemon, Column } from '../types';
import { PokemonTableRow } from './PokemonTableRow';

interface BodyProps {
  columns: Column[];
  pokemonData: Pokemon[];
  visibleColumns: Record<string, boolean>;
  selectedRowId: number | null;
  onRowClick: (id: number) => void;
  rowRefs: React.MutableRefObject<Record<number, HTMLTableRowElement | null>>;
}

export const PokemonTableBody: React.FC<BodyProps> = ({
  columns,
  pokemonData,
  visibleColumns,
  selectedRowId,
  onRowClick,
  rowRefs,
}) => {
  return (
    <TableBody>
      {pokemonData.map((pokemon) => (
        <PokemonTableRow
          key={pokemon.id}
          pokemon={pokemon}
          columns={columns}
          visibleColumns={visibleColumns}
          isSelected={selectedRowId === pokemon.id}
          onRowClick={onRowClick}
          rowRefs={rowRefs}
        />
      ))}
    </TableBody>
  );
};
