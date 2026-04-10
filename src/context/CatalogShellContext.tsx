import React, { createContext, useContext, useMemo, useState } from 'react';

import type { CatalogCategory, CatalogItem } from '../api/types';
import { useCatalog } from '../hooks/useCatalog';

type CatalogShellContextValue = {
  categories: CatalogCategory[];
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selected: CatalogItem | null;
  setSelected: React.Dispatch<React.SetStateAction<CatalogItem | null>>;
  editing: { item: CatalogItem; categoryId: string } | null;
  setEditing: React.Dispatch<
    React.SetStateAction<{ item: CatalogItem; categoryId: string } | null>
  >;
  deleting: { item: CatalogItem; categoryId: string } | null;
  setDeleting: React.Dispatch<
    React.SetStateAction<{ item: CatalogItem; categoryId: string } | null>
  >;
  addSheetOpen: boolean;
  setAddSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CatalogShellContext = createContext<CatalogShellContextValue | null>(null);

export function CatalogShellProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { data, isPending, isError, error, refetch } = useCatalog();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<CatalogItem | null>(null);
  const [editing, setEditing] = useState<{
    item: CatalogItem;
    categoryId: string;
  } | null>(null);
  const [deleting, setDeleting] = useState<{
    item: CatalogItem;
    categoryId: string;
  } | null>(null);
  const [addSheetOpen, setAddSheetOpen] = useState(false);

  const categories = data ?? [];

  const value = useMemo(
    () => ({
      categories,
      isPending,
      isError,
      error,
      refetch,
      sidebarOpen,
      setSidebarOpen,
      selected,
      setSelected,
      editing,
      setEditing,
      deleting,
      setDeleting,
      addSheetOpen,
      setAddSheetOpen,
    }),
    [
      categories,
      isPending,
      isError,
      error,
      refetch,
      sidebarOpen,
      selected,
      editing,
      deleting,
      addSheetOpen,
    ],
  );

  return (
    <CatalogShellContext.Provider value={value}>{children}</CatalogShellContext.Provider>
  );
}

export function useCatalogShell(): CatalogShellContextValue {
  const ctx = useContext(CatalogShellContext);
  if (ctx == null) {
    throw new Error('useCatalogShell must be used within CatalogShellProvider');
  }
  return ctx;
}
