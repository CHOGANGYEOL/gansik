"use client";
import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import {
  CssBaseline,
  InitColorSchemeScript,
  ThemeProvider,
} from "@mui/material";
import theme from "@/theme";
import { DialogsProvider } from "@toolpad/core";

export function MUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ enableCssLayer: true }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <DialogsProvider>{children}</DialogsProvider>
        </ThemeProvider>
      </AppRouterCacheProvider>
    </React.Fragment>
  );
}
