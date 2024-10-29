import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Pokemon } from '../types/index';

export const useRowSelection = (pokemonData: Pokemon[]) => {
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

  const handleRowClick = (id: number) => {
    setSelectedRowId((prevId) => (prevId === id ? null : id));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (selectedRowId === null) {
      if (pokemonData.length > 0) {
        setSelectedRowId(pokemonData[0].id);
      }
      return;
    }

    const currentIndex = pokemonData.findIndex((p) => p.id === selectedRowId);

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        setSelectedRowId(pokemonData[prevIndex].id);
      }
      // If at the top, do not move
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (currentIndex < pokemonData.length - 1) {
        const nextIndex = currentIndex + 1;
        setSelectedRowId(pokemonData[nextIndex].id);
      }
      // If at the bottom, do not move
    }
  };

  // Scroll the selected row into view when selectedRowId changes
  useEffect(() => {
    if (selectedRowId !== null) {
      const rowElement = rowRefs.current[selectedRowId];
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedRowId]);

  return {
    selectedRowId,
    handleRowClick,
    handleKeyDown,
    tableRef,
    rowRefs,
  };
};
