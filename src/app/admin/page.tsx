import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [works, bookings, contacts, users, reviewsPending] = await Promise.all([
    prisma.tattooWork.count({ where: { deletedAt: null } }),
    prisma.booking.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.review.count({
      where: { deletedAt: null, isPublished: false },
    }),
  ]);

  const stats = [
    { label: "Эскизы", value: works },
    { label: "Новые заявки", value: bookings },
    { label: "Сообщения", value: contacts },
    { label: "Пользователи", value: users },
    { label: "Отзывы на проверке", value: reviewsPending },
  ];

  const recentBookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { artist: true },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="border border-border bg-white p-6">
            <p className="text-xs uppercase tracking-wider text-muted">{s.label}</p>
            <p className="mt-2 font-display text-4xl">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="font-display text-2xl">Последние заявки</h2>
        <table className="mt-4 w-full border border-border bg-white text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs uppercase">
              <th className="p-3">Клиент</th>
              <th className="p-3">Дата</th>
              <th className="p-3">Мастер</th>
              <th className="p-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr key={b.id} className="border-b border-border">
                <td className="p-3">{b.clientName}</td>
                <td className="p-3">
                  {b.date.toLocaleDateString("ru")} {b.timeSlot}
                </td>
                <td className="p-3">{b.artist?.name ?? "—"}</td>
                <td className="p-3">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
