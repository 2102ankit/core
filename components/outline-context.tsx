"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type OutlineHeading = {
  id: string;
  text: string;
  level: number;
};

type OutlineContextValue = {
  headings: OutlineHeading[] | null;
  setHeadings: (headings: OutlineHeading[] | null) => void;
};

const OutlineContext = createContext<OutlineContextValue>({
  headings: null,
  setHeadings: () => {},
});

export function OutlineProvider({ children }: { children: ReactNode }) {
  const [headings, setHeadings] = useState<OutlineHeading[] | null>(null);
  const setHeadingsSafe = useCallback(
    (next: OutlineHeading[] | null) => setHeadings(next),
    [],
  );

  return (
    <OutlineContext.Provider value={{ headings, setHeadings: setHeadingsSafe }}>
      {children}
    </OutlineContext.Provider>
  );
}

export function useOutline() {
  return useContext(OutlineContext);
}

/**
 * Server-component bridge: render inside any page to publish its
 * headings to the app-wide outline context (consumed by the floating
 * rail and the navigation drawer).
 */
export function PublishOutline({ headings }: { headings: OutlineHeading[] }) {
  const { setHeadings } = useOutline();

  useEffect(() => {
    setHeadings(headings.length ? headings : null);
    return () => setHeadings(null);
  }, [headings, setHeadings]);

  return null;
}
