import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { CONTENT_DEFAULTS } from '../content/registry';

const CACHE_KEY = 'solex_content_v1';

function readCache(): Record<string, string> {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

interface ContentContextValue {
  /** Texte (ou URL d'image) d'un champ : valeur modifiée dans l'admin, sinon valeur par défaut. */
  get: (key: string) => string;
  refresh: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue>({
  get: (key) => CONTENT_DEFAULTS[key] ?? '',
  refresh: async () => {},
});

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overrides, setOverrides] = useState<Record<string, string>>(readCache);

  const refresh = useCallback(async () => {
    try {
      const data = await api.getContent();
      setOverrides(data);
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      } catch {
        /* stockage indisponible : sans importance */
      }
    } catch {
      /* serveur injoignable : on garde les textes déjà affichés */
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo<ContentContextValue>(
    () => ({
      get: (key: string) => {
        const custom = overrides[key];
        return typeof custom === 'string' && custom !== '' ? custom : CONTENT_DEFAULTS[key] ?? '';
      },
      refresh,
    }),
    [overrides, refresh]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => useContext(ContentContext);
