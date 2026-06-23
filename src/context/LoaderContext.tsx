"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";

type LoaderContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
  showLoaderFor: (ms?: number) => Promise<void>;
};

const LoaderContext = createContext<LoaderContextType>({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
  showLoaderFor: () => Promise.resolve(),
});

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const minDisplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const canHideRef = useRef(true);

  const showLoader = useCallback(() => {
    canHideRef.current = false;
    setIsLoading(true);
    // Enforce minimum display time of 500ms
    minDisplayTimerRef.current = setTimeout(() => {
      canHideRef.current = true;
    }, 500);
  }, []);

  const hideLoader = useCallback(() => {
    if (canHideRef.current) {
      setIsLoading(false);
    } else {
      // Wait until minimum display time passes
      setTimeout(() => setIsLoading(false), 100);
    }
  }, []);

  const showLoaderFor = useCallback((ms = 600): Promise<void> => {
    return new Promise((resolve) => {
      setIsLoading(true);
      canHideRef.current = false;
      setTimeout(() => {
        setIsLoading(false);
        canHideRef.current = true;
        resolve();
      }, ms);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (minDisplayTimerRef.current) {
        clearTimeout(minDisplayTimerRef.current);
      }
    };
  }, []);

  return (
    <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader, showLoaderFor }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  return useContext(LoaderContext);
}
