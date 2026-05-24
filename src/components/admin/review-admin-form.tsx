"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertReview } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TattooArtist } from "@prisma/client";

type ReviewAdminFormValues = {
  author: string;
  content: string;
  rating: number;
  artistId: string;
  isPublished: boolean;
};

export function ReviewAdminForm({ artists }: { artists: TattooArtist[] }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ReviewAdminFormValues>({
    defaultValues: {
      author: "",
      content: "",
      rating: 5,
      artistId: "",
      isPublished: true,
    },
  });

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const result = await upsertReview({
          author: data.author,
          content: data.content,
          rating: data.rating,
          artistId: data.artistId || undefined,
          isPublished: data.isPublished,
        });
        if (result.success) {
          toast.success("Отзыв сохранён");
          router.push("/admin/reviews");
          router.refresh();
        }
      })}
    >
      <div>
        <Label>Автор</Label>
        <Input {...register("author", { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>Оценка</Label>
        <Input
          type="number"
          min={1}
          max={5}
          {...register("rating", { valueAsNumber: true })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Мастер</Label>
        <select {...register("artistId")} className="mt-1 w-full border-b py-2 text-sm">
          <option value="">—</option>
          {artists.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label>Текст</Label>
        <Textarea {...register("content", { required: true })} rows={6} className="mt-1" />
      </div>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isPublished", { setValueAs: (v) => v === true || v === "on" })}
          defaultChecked
        />
        Опубликовать сразу
      </label>
      <Button type="submit">Сохранить</Button>
    </form>
  );
}
