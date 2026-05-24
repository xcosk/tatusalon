/** Обёртка админки: боковое меню + контент. Доступ только ADMIN/MANAGER (middleware.ts) */
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 overflow-auto bg-[#fafafa] p-8">{children}</div>
    </div>
  );
}
