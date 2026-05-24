/** Кнопка «Выйти» в личном кабинете — завершает сессию и ведёт на главную */
"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      <LogOut size={14} />
      Выйти
    </Button>
  );
}
