import { useState, useEffect } from 'react';
import { Column } from '../types/index';

export const useColumnVisibility = (columns: Column[]) => {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => {
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
    }
  );

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
  }, [visibleColumns, columns]);

  const handleToggleColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.hideable) {
      return;
    }
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return {
    visibleColumns,
    handleToggleColumn,
  };
};
