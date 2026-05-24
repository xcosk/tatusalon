import { prisma } from "@/lib/prisma";
import { updateBookingStatus } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import type { BookingStatus } from "@prisma/client";

const statuses: BookingStatus[] = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const bookings = await prisma.booking.findMany({
    where: {
      ...(params.status ? { status: params.status as BookingStatus } : {}),
      ...(params.q
        ? {
            OR: [
              { clientName: { contains: params.q, mode: "insensitive" } },
              { clientEmail: { contains: params.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { artist: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Заявки</h1>
      <form method="get" className="mt-4 flex gap-2">
        <input
          name="q"
          placeholder="Поиск..."
          defaultValue={params.q}
          className="border-b border-black px-2 py-1 text-sm"
        />
        <select name="status" defaultValue={params.status} className="border-b text-sm">
          <option value="">Все статусы</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button type="submit" className="text-xs uppercase underline">
          Фильтр
        </button>
      </form>
      <div className="mt-8">
        <DataTable headers={["Клиент", "Контакт", "Дата", "Мастер", "Статус", ""]}>
          {bookings.map((b) => (
            <tr key={b.id} className="border-b border-border">
              <td className="p-3">{b.clientName}</td>
              <td className="p-3 text-muted">
                {b.clientEmail}
                <br />
                {b.clientPhone}
              </td>
              <td className="p-3">
                {b.date.toLocaleDateString("ru")} {b.timeSlot}
              </td>
              <td className="p-3">{b.artist?.name ?? "—"}</td>
              <td className="p-3">{b.status}</td>
              <td className="p-3">
                <form
                  action={async (fd) => {
                    "use server";
                    await updateBookingStatus(b.id, fd.get("status") as BookingStatus);
                  }}
                  className="flex gap-1"
                >
                  <select name="status" defaultValue={b.status} className="text-xs border">
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className="text-xs underline">
                    OK
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  );
}
