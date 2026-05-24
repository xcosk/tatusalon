/**
 * Обёртка всего сайта: сессия входа (SessionProvider) и всплывающие уведомления (Toaster).
 * Подключена в src/app/layout.tsx
 */
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </SessionProvider>
  );
}
