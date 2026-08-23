"use client";

export type OutlineHeading = {
  id: string;
  text: string;
  level: number;
};

type Listener = (headings: OutlineHeading[] | null) => void;

let current: OutlineHeading[] | null = null;
const listeners = new Set<Listener>();

export function setOutlineHeadings(headings: OutlineHeading[] | null) {
  current = headings;
  listeners.forEach((listener) => listener(current));
}

export function subscribeOutlineHeadings(listener: Listener): () => void {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}
