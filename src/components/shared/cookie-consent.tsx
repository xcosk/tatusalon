"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ink-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Согласие на cookies"
      className="fixed bottom-4 left-4 right-4 z-[100] border border-border bg-white p-6 shadow-lg md:left-auto md:max-w-md"
    >
      <p className="text-sm text-muted">
        Мы используем cookies для аналитики и улучшения сайта. Продолжая, вы
        соглашаетесь с обработкой данных в соответствии с политикой
        конфиденциальности (GDPR).
      </p>
      <div className="mt-4 flex gap-3">
        <Button
          size="sm"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "accepted");
            setVisible(false);
          }}
        >
          Принять
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            localStorage.setItem(STORAGE_KEY, "declined");
            setVisible(false);
          }}
        >
          Отклонить
        </Button>
      </div>
    </div>
  );
}
