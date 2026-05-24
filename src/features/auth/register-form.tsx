"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(8),
});

export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  async function onSubmit(data: z.infer<typeof schema>) {
    const result = await registerUser(data);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    toast.success("Аккаунт создан!");
    router.push("/kabinet");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-8">
      <div>
        <h2 className="font-display text-4xl">РЕГИСТРАЦИЯ</h2>
        <p className="mt-2 text-sm text-muted">Создай аккаунт за минуту.</p>
      </div>
      {(["name", "phone", "email", "password"] as const).map((field) => (
        <div key={field}>
          <Label htmlFor={field}>
            {field === "name" ? "Имя" : field === "phone" ? "Телефон" : field === "email" ? "Email" : "Пароль"}
          </Label>
          <Input
            id={field}
            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
            {...register(field)}
            className="mt-2"
          />
          {errors[field] && (
            <p className="mt-1 text-xs text-red-600">{errors[field]?.message}</p>
          )}
        </div>
      ))}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Создание..." : "Создать аккаунт"}
      </Button>
      <p className="text-center text-xs text-muted">
        Уже есть аккаунт?{" "}
        <Link href="/vhod" className="text-black underline">
          Вход
        </Link>
      </p>
    </form>
  );
}
