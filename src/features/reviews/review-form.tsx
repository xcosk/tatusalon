/**
 * Форма отзыва (клиентская часть).
 * Отправляет данные в actions/reviews.ts → submitReview.
 * Без входа показывается ReviewFormGuestPrompt со ссылкой на /vhod.
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitReview } from "@/actions/reviews";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TattooArtist } from "@prisma/client";

const schema = z.object({
  content: z.string().min(20, "Минимум 20 символов").max(2000),
  rating: z.number().int().min(1).max(5),
  artistId: z.string().optional(),
});

type ReviewFormData = z.infer<typeof schema>;

export function ReviewForm({ artists }: { artists: TattooArtist[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, artistId: "", content: "" },
  });

  async function onSubmit(data: ReviewFormData) {
    const result = await submitReview({
      ...data,
      artistId: data.artistId || undefined,
    });
    if (result.success) {
      toast.success("Отзыв отправлен на проверку. Появится после одобрения администратора.");
      reset({ rating: 5, artistId: "", content: "" });
      router.refresh();
    } else {
      toast.error(result.error ?? "Не удалось отправить отзыв");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      <div>
        <Label htmlFor="rating">Оценка</Label>
        <select
          id="rating"
          {...register("rating", { valueAsNumber: true })}
          className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm outline-none"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} из 5
            </option>
          ))}
        </select>
        {errors.rating && (
          <p className="mt-1 text-xs text-red-600">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="artistId">Мастер (необязательно)</Label>
        <select
          id="artistId"
          {...register("artistId")}
          className="mt-2 w-full border-b border-black bg-transparent py-3 text-sm outline-none"
        >
          <option value="">Студия в целом</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="content">Ваш отзыв</Label>
        <Textarea
          id="content"
          rows={5}
          placeholder="Расскажите о визите в студию..."
          {...register("content")}
          className="mt-2"
        />
        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Отправка..." : "Отправить на проверку"}
      </Button>
    </form>
  );
}

export function ReviewFormGuestPrompt() {
  return (
    <p className="text-sm text-muted">
      <Link href="/vhod?callbackUrl=/o-nas" className="underline text-black">
        Войдите
      </Link>
      , чтобы оставить отзыв. После отправки он появится на сайте только после
      проверки администратором.
    </p>
  );
}
