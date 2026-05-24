/**
 * Форма записи на /zapis.
 * Две версии: для гостя (все поля) и для вошедшего (без email/телефона).
 * Отправка → actions/booking.ts → createBooking
 */
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { createBooking } from "@/actions/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BOOKING_TIME_SLOTS } from "@/lib/constants";
import type { TattooArtist } from "@prisma/client";

const guestSchema = z.object({
  artistId: z.string().optional(),
  clientName: z.string().min(2, "Введите имя"),
  clientEmail: z.string().email("Некорректный email"),
  clientPhone: z.string().min(10, "Введите телефон"),
  idea: z.string().optional(),
  date: z.string().min(1, "Выберите дату"),
  timeSlot: z.string().min(1, "Выберите время"),
});

const memberSchema = z.object({
  artistId: z.string().optional(),
  idea: z.string().optional(),
  date: z.string().min(1, "Выберите дату"),
  timeSlot: z.string().optional(),
});

type GuestFormData = z.infer<typeof guestSchema>;
type MemberFormData = z.infer<typeof memberSchema>;

export function BookingForm({ artists }: { artists: TattooArtist[] }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("artist");
  const isMember = status === "authenticated" && !!session?.user;

  const guestForm = useForm<GuestFormData>({
    resolver: zodResolver(guestSchema),
  });

  const memberForm = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
  });

  useEffect(() => {
    if (!preselectedSlug) return;
    const artist = artists.find((a) => a.slug === preselectedSlug);
    if (!artist) return;
    if (isMember) {
      memberForm.setValue("artistId", artist.id);
    } else {
      guestForm.setValue("artistId", artist.id);
    }
  }, [preselectedSlug, artists, isMember, memberForm, guestForm]);

  const minDate = new Date().toISOString().split("T")[0];

  async function onSubmitGuest(data: GuestFormData) {
    const result = await createBooking(data);
    if (result.success) {
      toast.success("Заявка отправлена! Мы свяжемся в течение 24 часов.");
      guestForm.reset();
    } else {
      toast.error(result.error ?? "Ошибка отправки");
    }
  }

  async function onSubmitMember(data: MemberFormData) {
    const result = await createBooking(data);
    if (result.success) {
      toast.success("Запись создана! Смотрите в личном кабинете.");
      memberForm.reset({ artistId: data.artistId });
      router.push("/kabinet");
      router.refresh();
    } else {
      toast.error(result.error ?? "Ошибка отправки");
    }
  }

  if (status === "loading") {
    return <p className="text-sm text-muted">Загрузка...</p>;
  }

  if (isMember) {
    return (
      <form
        onSubmit={memberForm.handleSubmit(onSubmitMember)}
        className="max-w-lg space-y-8"
      >
        <p className="text-sm text-muted">
          Вы вошли как{" "}
          <span className="text-black">{session.user.name ?? session.user.email}</span>.
          Контакты подставятся из профиля.
        </p>

        <div>
          <Label htmlFor="artistId-member">Мастер</Label>
          <select
            id="artistId-member"
            {...memberForm.register("artistId")}
            className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm outline-none"
          >
            <option value="">Любой свободный мастер</option>
            {artists.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.styles.join(", ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="date-member">Дата</Label>
          <Input
            id="date-member"
            type="date"
            min={minDate}
            {...memberForm.register("date")}
            className="mt-2"
          />
          {memberForm.formState.errors.date && (
            <p className="mt-1 text-xs text-red-600">
              {memberForm.formState.errors.date.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="timeSlot-member">Время (необязательно)</Label>
          <select
            id="timeSlot-member"
            {...memberForm.register("timeSlot")}
            className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm"
          >
            <option value="">Уточним позже</option>
            {BOOKING_TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label htmlFor="idea-member">Комментарий / идея</Label>
          <Textarea
            id="idea-member"
            placeholder="Опишите идею татуировки..."
            {...memberForm.register("idea")}
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          disabled={memberForm.formState.isSubmitting}
          className="w-full"
        >
          {memberForm.formState.isSubmitting ? "Отправка..." : "Записаться"}
        </Button>
      </form>
    );
  }

  return (
    <form
      onSubmit={guestForm.handleSubmit(onSubmitGuest)}
      className="max-w-lg space-y-8"
    >
      <p className="text-sm text-muted">
        <a href="/vhod" className="underline text-black">
          Войдите
        </a>
        , чтобы записаться без ввода email и телефона.
      </p>

      <div>
        <Label htmlFor="artistId">Мастер</Label>
        <select
          id="artistId"
          {...guestForm.register("artistId")}
          className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm outline-none"
        >
          <option value="">Любой свободный мастер</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name} — {a.styles.join(", ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="clientName">Имя</Label>
        <Input id="clientName" {...guestForm.register("clientName")} className="mt-2" />
        {guestForm.formState.errors.clientName && (
          <p className="mt-1 text-xs text-red-600">
            {guestForm.formState.errors.clientName.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="clientEmail">Email</Label>
        <Input
          id="clientEmail"
          type="email"
          {...guestForm.register("clientEmail")}
          className="mt-2"
        />
        {guestForm.formState.errors.clientEmail && (
          <p className="mt-1 text-xs text-red-600">
            {guestForm.formState.errors.clientEmail.message}
          </p>
        )}
      </div>
      <div>
        <Label htmlFor="clientPhone">Телефон</Label>
        <Input id="clientPhone" {...guestForm.register("clientPhone")} className="mt-2" />
        {guestForm.formState.errors.clientPhone && (
          <p className="mt-1 text-xs text-red-600">
            {guestForm.formState.errors.clientPhone.message}
          </p>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            type="date"
            min={minDate}
            {...guestForm.register("date")}
            className="mt-2"
          />
          {guestForm.formState.errors.date && (
            <p className="mt-1 text-xs text-red-600">
              {guestForm.formState.errors.date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="timeSlot">Время</Label>
          <select
            id="timeSlot"
            {...guestForm.register("timeSlot")}
            className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm"
          >
            <option value="">Выберите</option>
            {BOOKING_TIME_SLOTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {guestForm.formState.errors.timeSlot && (
            <p className="mt-1 text-xs text-red-600">
              {guestForm.formState.errors.timeSlot.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="idea">Идея / комментарий</Label>
        <Textarea id="idea" {...guestForm.register("idea")} className="mt-2" />
      </div>
      <Button
        type="submit"
        disabled={guestForm.formState.isSubmitting}
        className="w-full"
      >
        {guestForm.formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
