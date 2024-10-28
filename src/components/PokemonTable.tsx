import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Collapse, Paper
} from '@mui/material';

interface Pokemon {
  name: string;
  id: number;
  image: string;
  height: number;
  weight: number;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
}

interface TableProps {
  pokemonData: Pokemon[];
}

interface Column {
  id: keyof Pokemon;
  label: string;
  hideable: boolean;
  width: number | string;
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
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    // Initialize all columns to visible
    const initialVisibility = columns.reduce((acc, column) => {
      acc[column.id] = true;
      return acc;
    }, {} as Record<string, boolean>);

    const storedVisibility = localStorage.getItem('visibleColumns');
    if (storedVisibility) {
      const parsedVisibility = JSON.parse(storedVisibility);
      // Override with stored visibility for hideable columns
      columns.forEach((column) => {
        if (column.hideable && parsedVisibility.hasOwnProperty(column.id)) {
          initialVisibility[column.id] = parsedVisibility[column.id];
        }
      });
    }
    return initialVisibility;
  });

  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  // Update localStorage whenever visibleColumns changes
  useEffect(() => {
    // Store only hideable columns' visibility
    const hideableColumnsVisibility = Object.fromEntries(
      Object.entries(visibleColumns).filter(([key]) => {
        const column = columns.find((col) => col.id === key);
        return column?.hideable;
      })
    );
    localStorage.setItem('visibleColumns', JSON.stringify(hideableColumnsVisibility));
  }, [visibleColumns]);

  const handleToggleColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.hideable) {
      return;
    }
    const updatedColumns = {
      ...visibleColumns,
      [columnId]: !visibleColumns[columnId],
    };
    setVisibleColumns(updatedColumns);
  };

  const handleRowClick = (id: number) => {
    if (selectedRowId === id) {
      setSelectedRowId(null); // Deselect if already selected
    } else {
      setSelectedRowId(id);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (selectedRowId === null) {
      // If no row is selected, select the first one
      if (pokemonData.length > 0) {
        setSelectedRowId(pokemonData[0].id);
      }
      return;
    }
    const currentIndex = pokemonData.findIndex((p) => p.id === selectedRowId);
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : pokemonData.length - 1;
      setSelectedRowId(pokemonData[prevIndex].id);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = currentIndex < pokemonData.length - 1 ? currentIndex + 1 : 0;
      setSelectedRowId(pokemonData[nextIndex].id);
    }
  };

  // Remove the useEffect that focuses the table on mount
  // useEffect(() => {
  //   if (tableRef.current) {
  //     tableRef.current.focus();
  //   }
  // }, []);

  // Scroll the selected row into view when selectedRowId changes
  useEffect(() => {
    if (selectedRowId !== null) {
      const rowElement = rowRefs.current[selectedRowId];
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedRowId]);

  // Utility function to capitalize the first letter
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="Table">
      {/* Your app's heading or other content can be placed here */}
      {/* <h1>Your App's Heading</h1> */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          backgroundColor: '#f5f5f5',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    width: column.width,
                    fontFamily: 'Gill Sans',
                    padding: '8px',
                    cursor: column.hideable ? 'pointer' : 'default',
                    textAlign: 'center',
                    backgroundColor: '#f5f5f5',
                  }}
                  onClick={() => handleToggleColumn(column.id)}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        </Table>
      </div>
      <TableContainer
        component={Paper}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={tableRef}
        style={{
          outline: 'none',
        }}
      >
        <Table style={{ tableLayout: 'fixed' }}>
          <TableBody>
            {pokemonData.map((pokemon) => (
              <React.Fragment key={pokemon.id}>
                <TableRow
                  ref={(el) => {
                    rowRefs.current[pokemon.id] = el;
                  }}
                  hover
                  selected={selectedRowId === pokemon.id}
                  onClick={() => handleRowClick(pokemon.id)}
                  style={{ cursor: 'pointer' }}
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
                {/* Display additional information when the row is selected */}
                {selectedRowId === pokemon.id && (
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={columns.length}
                    >
                      <Collapse in={true} timeout="auto" unmountOnExit>
                        <div style={{ margin: '1rem', textAlign: 'center', fontFamily: 'Gill Sans', }}>
                          <p>
                            <strong>HP:</strong> {pokemon.hp}
                          </p>
                          <p>
                            <strong>Attack:</strong> {pokemon.attack}
                          </p>
                          <p>
                            <strong>Defense:</strong> {pokemon.defense}
                          </p>
                        </div>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
