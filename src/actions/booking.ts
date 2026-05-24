/**
 * ЗАПИСЬ НА СЕАНС (/zapis)
 *
 * createBooking — одна функция для гостя и для залогиненного:
 * — Гость: имя, email, телефон, дата, время (guestBookingSchema)
 * — Вошедший: дата, мастер, комментарий; контакты из профиля User (memberBookingSchema)
 *
 * Заявки смотреть: /admin/bookings и в /kabinet у пользователя
 */
"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { sendTelegramMessage } from "@/lib/telegram";
import { z } from "zod";

const guestBookingSchema = z.object({
  artistId: z.string().optional(),
  clientName: z.string().min(2, "Введите имя"),
  clientEmail: z.string().email("Некорректный email"),
  clientPhone: z.string().min(10, "Введите телефон"),
  idea: z.string().optional(),
  date: z.string().min(1, "Выберите дату"),
  timeSlot: z.string().min(1, "Выберите время"),
});

const memberBookingSchema = z.object({
  artistId: z.string().optional(),
  idea: z.string().optional(),
  date: z.string().min(1, "Выберите дату"),
  timeSlot: z.string().optional(),
});

export type GuestBookingInput = z.infer<typeof guestBookingSchema>;
export type MemberBookingInput = z.infer<typeof memberBookingSchema>;

export type ActionResult = { success: boolean; error?: string; id?: string };

export async function createBooking(
  data: GuestBookingInput | MemberBookingInput,
): Promise<ActionResult> {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const parsed = memberBookingSchema.safeParse(data);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { success: false, error: "Пользователь не найден" };
    }

    const clientEmail = user.email;
    const limited = rateLimit(`booking:${clientEmail}`, 10, 3600_000);
    if (!limited.success) {
      return { success: false, error: "Слишком много заявок. Попробуйте позже." };
    }

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        artistId: parsed.data.artistId || null,
        clientName: user.name ?? user.email.split("@")[0],
        clientEmail,
        clientPhone: user.phone ?? "—",
        idea: parsed.data.idea,
        date: new Date(parsed.data.date),
        timeSlot: parsed.data.timeSlot ?? "Уточнить",
      },
      include: { artist: true },
    });

    await notifyBooking(booking, parsed.data.date, parsed.data.timeSlot ?? "Уточнить", parsed.data.idea);
    revalidatePath("/kabinet");
    revalidatePath("/zapis");

    return { success: true, id: booking.id };
  }

  const parsed = guestBookingSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  const limited = rateLimit(`booking:${parsed.data.clientEmail}`, 5, 3600_000);
  if (!limited.success) {
    return { success: false, error: "Слишком много заявок. Попробуйте позже." };
  }

  const booking = await prisma.booking.create({
    data: {
      artistId: parsed.data.artistId || null,
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail,
      clientPhone: parsed.data.clientPhone,
      idea: parsed.data.idea,
      date: new Date(parsed.data.date),
      timeSlot: parsed.data.timeSlot,
    },
    include: { artist: true },
  });

  await notifyBooking(booking, parsed.data.date, parsed.data.timeSlot, parsed.data.idea);
  revalidatePath("/zapis");

  return { success: true, id: booking.id };
}

async function notifyBooking(
  booking: {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    artist: { name: string } | null;
  },
  date: string,
  timeSlot: string,
  idea?: string,
) {
  const message = [
    "🖤 Новая заявка INK / STUDIO",
    `Имя: ${booking.clientName}`,
    `Email: ${booking.clientEmail}`,
    `Телефон: ${booking.clientPhone}`,
    booking.artist ? `Мастер: ${booking.artist.name}` : null,
    `Дата: ${date}${timeSlot !== "Уточнить" ? ` ${timeSlot}` : ""}`,
    idea ? `Комментарий: ${idea}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  await Promise.all([
    sendTelegramMessage(message),
    sendEmail({
      to: booking.clientEmail,
      subject: "Заявка принята — INK / STUDIO",
      html: `<p>Здравствуйте, ${booking.clientName}!</p><p>Мы получили вашу заявку на ${date}. Мастер свяжется с вами в течение 24 часов.</p>`,
    }),
  ]);
}
