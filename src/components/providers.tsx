"use client";

import React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { ToastProvider } from "@/components/beui/animated-toast-stack";
import { AuthProvider } from "@/context/auth-context";
import { AuthModal } from "@/components/auth/auth-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        <AuthProvider>
          {children}
          <AuthModal />
        </AuthProvider>
      </ToastProvider>
    </NextThemesProvider>
  );
}
