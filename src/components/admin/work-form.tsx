"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertWork } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TattooWork, Category, TattooArtist } from "@prisma/client";

type WorkFormValues = {
  title: string;
  description: string;
  style: string;
  priceFrom: number;
  imageUrl: string;
  categoryId: string;
  artistId: string;
  isFeatured: boolean;
  isPublished: boolean;
};

type Props = {
  work?: TattooWork;
  categories: Category[];
  artists: TattooArtist[];
};

function toFormValues(work?: TattooWork): WorkFormValues {
  if (!work) {
    return {
      title: "",
      description: "",
      style: "",
      priceFrom: 0,
      imageUrl: "",
      categoryId: "",
      artistId: "",
      isFeatured: false,
      isPublished: true,
    };
  }

  return {
    title: work.title,
    description: work.description ?? "",
    style: work.style ?? "",
    priceFrom: work.priceFrom ?? 0,
    imageUrl: work.imageUrl,
    categoryId: work.categoryId ?? "",
    artistId: work.artistId ?? "",
    isFeatured: work.isFeatured,
    isPublished: work.isPublished,
  };
}

export function WorkForm({ work, categories, artists }: Props) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<WorkFormValues>({
    defaultValues: toFormValues(work),
  });

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const result = await upsertWork({
          id: work?.id,
          title: data.title,
          description: data.description,
          style: data.style,
          priceFrom: data.priceFrom || undefined,
          imageUrl: data.imageUrl,
          categoryId: data.categoryId || undefined,
          artistId: data.artistId || undefined,
          isFeatured: data.isFeatured,
          isPublished: data.isPublished,
        });
        if (result.success) {
          toast.success("Сохранено");
          router.push("/admin/works");
          router.refresh();
        }
      })}
    >
      <div>
        <Label>Название</Label>
        <Input {...register("title", { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>URL изображения</Label>
        <Input {...register("imageUrl", { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>Стиль</Label>
        <Input {...register("style")} className="mt-1" />
      </div>
      <div>
        <Label>Цена от</Label>
        <Input
          type="number"
          {...register("priceFrom", { valueAsNumber: true })}
          className="mt-1"
        />
      </div>
      <div>
        <Label>Описание</Label>
        <Textarea {...register("description")} className="mt-1" />
      </div>
      <div>
        <Label>Категория</Label>
        <select {...register("categoryId")} className="mt-1 w-full border-b py-2 text-sm">
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
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
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isFeatured", { setValueAs: (v) => v === true || v === "on" })}
        />
        В избранном на главной
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isPublished", { setValueAs: (v) => v === true || v === "on" })}
          defaultChecked={work?.isPublished ?? true}
        />
        Опубликован
      </label>
      <Button type="submit">Сохранить</Button>
    </form>
  );
}
