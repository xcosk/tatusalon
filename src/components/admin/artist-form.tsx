"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { upsertArtist } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TattooArtist } from "@prisma/client";

type ArtistFormValues = {
  name: string;
  bio: string;
  styles: string;
  photoUrl: string;
  isActive: boolean;
};

export function ArtistForm({ artist }: { artist?: TattooArtist }) {
  const router = useRouter();
  const { register, handleSubmit } = useForm<ArtistFormValues>({
    defaultValues: {
      name: artist?.name ?? "",
      bio: artist?.bio ?? "",
      styles: artist?.styles.join(", ") ?? "",
      photoUrl: artist?.photoUrl ?? "",
      isActive: artist?.isActive ?? true,
    },
  });

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={handleSubmit(async (data) => {
        const result = await upsertArtist({
          id: artist?.id,
          name: data.name,
          bio: data.bio,
          styles: data.styles.split(",").map((s) => s.trim()).filter(Boolean),
          photoUrl: data.photoUrl || undefined,
          isActive: data.isActive,
        });
        if (result.success) {
          toast.success("Сохранено");
          router.push("/admin/masters");
        }
      })}
    >
      <div>
        <Label>Имя</Label>
        <Input {...register("name", { required: true })} className="mt-1" />
      </div>
      <div>
        <Label>Стили (через запятую)</Label>
        <Input {...register("styles")} className="mt-1" />
      </div>
      <div>
        <Label>Фото URL</Label>
        <Input {...register("photoUrl")} className="mt-1" />
      </div>
      <div>
        <Label>Био</Label>
        <Textarea {...register("bio")} className="mt-1" />
      </div>
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          {...register("isActive", { setValueAs: (v) => v === true || v === "on" })}
          defaultChecked={artist?.isActive ?? true}
        />
        Активен
      </label>
      <Button type="submit">Сохранить</Button>
    </form>
  );
}
