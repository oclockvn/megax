"use client";

import useScrollDirection, { ScrollDir } from "@/hooks/useScroll";
import React, { createContext } from "react";

export const ScrollContext = createContext<ScrollDir | undefined>(undefined);

export default function ScrollDirectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dir = useScrollDirection();

  return (
    <ScrollContext.Provider value={dir}>{children}</ScrollContext.Provider>
  );
}
