import { prisma } from "@/lib/prisma";
import { updateContactStatus } from "@/actions/admin";
import type { ContactStatus } from "@prisma/client";

const statuses: ContactStatus[] = ["NEW", "IN_PROGRESS", "RESOLVED"];

export default async function AdminContactsPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Сообщения</h1>
      <div className="mt-8 space-y-6">
        {messages.map((m) => (
          <div key={m.id} className="border border-border bg-white p-4">
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{m.name}</p>
                <p className="text-sm text-muted">
                  {m.email} {m.phone && `· ${m.phone}`}
                </p>
              </div>
              <form
                action={async (fd) => {
                  "use server";
                  await updateContactStatus(m.id, fd.get("status") as ContactStatus);
                }}
              >
                <select name="status" defaultValue={m.status} className="text-xs border">
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button type="submit" className="ml-2 text-xs underline">
                  OK
                </button>
              </form>
            </div>
            <p className="mt-3 text-sm">{m.message}</p>
            <p className="mt-2 text-xs text-muted">
              {m.createdAt.toLocaleString("ru")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
