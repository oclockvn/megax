"use client";

import React from "react";
import { ThemeProvider } from "@mui/material";
import theme from "@/lib/mui.theme";

export default function MuiThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
}
