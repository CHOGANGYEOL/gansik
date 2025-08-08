"use client";

import { useColorScheme } from "@mui/material";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

export function ToastWrapper() {
  const { mode } = useColorScheme();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (mode === "system" || !mode) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(mode);
    }
  }, [mode]);
  return <ToastContainer theme={resolvedTheme} />;
}
