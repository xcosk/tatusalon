/**
 * ФОРМА КОНТАКТОВ (/kontakty)
 * submitContact — сохраняет сообщение в ContactMessage, опционально шлёт в Telegram.
 */
"use server";

import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendTelegramMessage } from "@/lib/telegram";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
});

export type ActionResult = { success: boolean; error?: string };

export async function submitContact(
  data: z.infer<typeof contactSchema>,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const limited = rateLimit(`contact:${parsed.data.email}`, 5, 3600_000);
  if (!limited.success) {
    return { success: false, error: "Слишком много сообщений. Попробуйте позже." };
  }

  await prisma.contactMessage.create({ data: parsed.data });

  await sendTelegramMessage(
    [
      "📩 Сообщение с сайта",
      `Имя: ${parsed.data.name}`,
      `Email: ${parsed.data.email}`,
      parsed.data.phone ? `Тел: ${parsed.data.phone}` : null,
      parsed.data.message,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return { success: true };
}
