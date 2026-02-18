import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../components/ToastNotification';

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string, options?: { duration?: number; action?: { label: string; onClick: () => void } }) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showSuccess: (title: string, message?: string, options?: { duration?: number }) => string;
  showError: (title: string, message?: string, options?: { action?: { label: string; onClick: () => void } }) => string;
  showWarning: (title: string, message?: string, options?: { duration?: number }) => string;
  showInfo: (title: string, message?: string, options?: { duration?: number }) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function useToastState(): ToastContextValue {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      type: ToastType,
      title: string,
      message?: string,
      options?: { duration?: number; action?: { label: string; onClick: () => void } }
    ) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = {
        id,
        type,
        title,
        message,
        duration: options?.duration ?? (type === 'error' ? 0 : 5000),
        action: options?.action
      };
      setToasts((prev) => [...prev, toast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, options?: { duration?: number }) => {
      return addToast('success', title, message, options);
    },
    [addToast]
  );

  const showError = useCallback(
    (
      title: string,
      message?: string,
      options?: { action?: { label: string; onClick: () => void } }
    ) => {
      return addToast('error', title, message, { duration: 0, ...options });
    },
    [addToast]
  );

  const showWarning = useCallback(
    (title: string, message?: string, options?: { duration?: number }) => {
      return addToast('warning', title, message, options);
    },
    [addToast]
  );

  const showInfo = useCallback(
    (title: string, message?: string, options?: { duration?: number }) => {
      return addToast('info', title, message, options);
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useToastState();
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
