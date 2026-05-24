import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = { title: "Вход" };

export default function LoginPage() {
  return (
    <section className="container-site grid min-h-[calc(100vh-65px-210px)] lg:grid-cols-2">
      <div className="flex flex-col justify-between border-r border-border py-16 pr-8">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">№ 014 / Вход</p>
        <h1 className="font-display text-[clamp(4rem,10vw,10rem)] leading-[0.85] whitespace-pre-line">
          {"С ВО-\nЗВРА-\nЩЕ-\nНИЕМ."}
        </h1>
        <p className="text-xs text-muted">
          Личный кабинет / История записей / Избранное
        </p>
      </div>
      <div className="flex items-center justify-center py-16">
        <Suspense fallback={<Skeleton className="h-64 w-full max-w-sm" />}>
          <LoginForm />
        </Suspense>
      </div>
    </section>
  );
}
