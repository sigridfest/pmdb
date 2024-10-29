import React from 'react';
import { TableRow, TableCell, Collapse } from '@mui/material';
import { Pokemon, Column } from '../types';
import { capitalizeFirstLetter } from '../utils';

interface RowProps {
  pokemon: Pokemon;
  columns: Column[];
  visibleColumns: Record<string, boolean>;
  isSelected: boolean;
  onRowClick: (id: number) => void;
  rowRefs: React.MutableRefObject<Record<number, HTMLTableRowElement | null>>;
}

const HEADER_HEIGHT = 40.8;

export const PokemonTableRow: React.FC<RowProps> = ({
  pokemon,
  columns,
  visibleColumns,
  isSelected,
  onRowClick,
  rowRefs,
}) => {
  return (
    <>
      <TableRow
        ref={(el) => {
          rowRefs.current[pokemon.id] = el;
        }}
        hover
        selected={isSelected}
        onClick={() => onRowClick(pokemon.id)}
        style={{ cursor: 'pointer', scrollMarginTop: `${HEADER_HEIGHT}px`,  }}
      >
        {columns.map((column) => (
          <TableCell
            key={column.id}
            style={{
              width: column.width,
              fontFamily: 'Gill Sans',
              padding: '8px',
              textAlign: 'center',
            }}
          >
            {visibleColumns[column.id]
              ? (() => {
                  switch (column.id) {
                    case 'id':
                      return pokemon.id;
                    case 'name':
                      return capitalizeFirstLetter(pokemon.name);
                    case 'image':
                      return (
                        <img
                          src={pokemon.image}
                          alt={pokemon.name}
                          style={{ width: '100%', maxWidth: '50px' }}
                        />
                      );
                    case 'types':
                      return (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {pokemon.types.map((type, index) => (
                            <span key={index}>{capitalizeFirstLetter(type)}</span>
                          ))}
                        </div>
                      );
                    case 'height':
                      return pokemon.height;
                    case 'weight':
                      return pokemon.weight;
                    default:
                      return null;
                  }
                })()
              : null}
          </TableCell>
        ))}
      </TableRow>
      {isSelected && (
        <TableRow>
          <TableCell
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={columns.length}
          >
            <Collapse in={true} timeout="auto" unmountOnExit>
              <div style={{ margin: '1rem', textAlign: 'center'}}>
                <p>
                  <strong>HP:</strong> {pokemon.hp}
                </p>
                <p>
                  <strong>Attack:</strong> {pokemon.attack}
                </p>
                <p>
                  <strong>Defense:</strong> {pokemon.defense}
                </p>
                <p>
                  <strong>Speed:</strong> {pokemon.speed}
                </p>
              </div>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
