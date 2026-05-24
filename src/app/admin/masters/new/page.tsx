import { ArtistForm } from "@/components/admin/artist-form";

export default function NewMasterPage() {
  return (
    <div>
      <h1 className="font-display text-4xl">Новый мастер</h1>
      <div className="mt-8">
        <ArtistForm />
      </div>
    </div>
  );
}
