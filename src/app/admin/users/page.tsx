import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/actions/admin";
import { DataTable } from "@/components/admin/data-table";
import type { Role } from "@prisma/client";

const roles: Role[] = ["USER", "MANAGER", "ADMIN"];

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-4xl">Пользователи</h1>
      <div className="mt-8">
        <DataTable headers={["Email", "Имя", "Роль", ""]}>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-border">
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.name ?? "—"}</td>
              <td className="p-3">{u.role}</td>
              <td className="p-3">
                <form
                  action={async (fd) => {
                    "use server";
                    await updateUserRole(u.id, fd.get("role") as Role);
                  }}
                  className="flex gap-1"
                >
                  <select name="role" defaultValue={u.role} className="text-xs border">
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
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
