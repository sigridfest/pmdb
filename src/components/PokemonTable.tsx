import React from 'react';
import { Table, TableContainer, Paper } from '@mui/material';
import { Pokemon, Column } from '../types';
import { useColumnVisibility } from '../hooks/useColumnVisibility';
import { useRowSelection } from '../hooks/useRowSelection';
import { PokemonTableHeader } from './PokemonTableHeader';
import { PokemonTableBody } from './PokemonTableBody';

interface TableProps {
  pokemonData: Pokemon[];
}

const columns: Column[] = [
  { id: 'id', label: 'ID', hideable: false, width: '10%' },
  { id: 'name', label: 'Name', hideable: false, width: '20%' },
  { id: 'image', label: 'Image', hideable: true, width: '15%' },
  { id: 'types', label: 'Types', hideable: true, width: '20%' },
  { id: 'height', label: 'Height', hideable: true, width: '15%' },
  { id: 'weight', label: 'Weight', hideable: true, width: '15%' },
];

export const PokemonTable: React.FC<TableProps> = ({ pokemonData }) => {
  const { visibleColumns, handleToggleColumn } = useColumnVisibility(columns);
  const {
    selectedRowId,
    handleRowClick,
    handleKeyDown,
    tableRef,
    rowRefs,
  } = useRowSelection(pokemonData);

  return (
    <div style={{width: '60%', fontFamily: 'Gill Sans',}}>

      <div style={{paddingTop: '20px', paddingBottom: '20px',}}>

        <h1 style={{ fontSize: '50px', color: 'white', textAlign: 'center',}}>PokémonDB</h1>

      </div>

      <PokemonTableHeader
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />

      <TableContainer
        component={Paper}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={tableRef}
        style={{outline: 'none',}}
      >
        <Table style={{ tableLayout: 'fixed' }}>
          <PokemonTableBody
            columns={columns}
            pokemonData={pokemonData}
            visibleColumns={visibleColumns}
            selectedRowId={selectedRowId}
            onRowClick={handleRowClick}
            rowRefs={rowRefs}
          />
        </Table>

      </TableContainer>

    </div>
  );
};