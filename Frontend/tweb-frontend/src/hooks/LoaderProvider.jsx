// hooks/LoaderProvider.jsx
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Loader from '../components/Loader';

const LoaderCtx = createContext(null);

export function LoaderProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState('Loading');
  const pending = useRef(0); // <-- contatore richieste aperte

  const internalOpen = () => {
    setOpen(true);
    document.documentElement.style.overflow = 'hidden';
  };
  const internalClose = () => {
    setOpen(false);
    document.documentElement.style.overflow = '';
  };

  const show = useCallback((msg) => {
    if (msg) setLabel(msg);
    pending.current += 1;
    internalOpen();
    // restituisco un disposer opzionale per comodità
    return () => {
      pending.current = Math.max(0, pending.current - 1);
      if (pending.current === 0) internalClose();
    };
  }, []);

  const hide = useCallback(() => {
    pending.current = Math.max(0, pending.current - 1);
    if (pending.current === 0) internalClose();
  }, []);

  const withLoader = useCallback(async (fn, msg = 'Loading') => {
    const dispose = show(msg);
    try {
      return await fn();
    } finally {
      dispose(); // equivalente a hide()
    }
  }, [show]);

  const value = useMemo(() => ({ show, hide, withLoader, setLabel }), [show, hide, withLoader]);

  return (
    <LoaderCtx.Provider value={value}>
      {children}
      <Loader open={open} variant="overlay" label={label} />
    </LoaderCtx.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderCtx);
  if (!ctx) throw new Error('useLoader must be used within LoaderProvider');
  return ctx;
}
