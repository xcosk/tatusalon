"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/kabinet";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(data: z.infer<typeof schema>) {
    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Неверный email или пароль");
      return;
    }
    toast.success("Добро пожаловать!");
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-8">
      <div>
        <h2 className="font-display text-4xl">ВХОД</h2>
        <p className="mt-2 text-sm text-muted">Войди, чтобы увидеть свои записи.</p>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} className="mt-2" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" type="password" {...register("password")} className="mt-2" />
        {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Вход..." : "Войти"}
      </Button>
      <p className="text-center text-xs text-muted">
        Нет аккаунта?{" "}
        <Link href="/registraciya" className="text-black underline">
          Регистрация
        </Link>
      </p>
    </form>
  );
}
