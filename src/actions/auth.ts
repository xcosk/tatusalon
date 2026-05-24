/**
 * РЕГИСТРАЦИЯ (/registraciya)
 * registerUser — создаёт User с ролью USER и хешем пароля. Вход потом через /vhod (lib/auth.ts).
 */
"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  phone: z.string().min(10, "Введите телефон"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function registerUser(
  data: z.infer<typeof registerSchema>,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const limited = rateLimit(`register:${parsed.data.email}`, 5, 3600_000);
  if (!limited.success) {
    return { success: false, error: "Слишком много попыток. Попробуйте позже." };
  }

  const exists = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (exists) {
    return { success: false, error: "Email уже зарегистрирован" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email.toLowerCase(),
      passwordHash,
    },
  });

  return { success: true };
}
