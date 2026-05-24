import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArtistForm } from "@/components/admin/artist-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditMasterPage({ params }: Props) {
  const { id } = await params;
  const artist = await prisma.tattooArtist.findUnique({ where: { id } });
  if (!artist) notFound();
  return (
    <div>
      <h1 className="font-display text-4xl">Редактировать мастера</h1>
      <div className="mt-8">
        <ArtistForm artist={artist} />
      </div>
    </div>
  );
}
