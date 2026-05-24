/**
 * Расширение типов NextAuth: в session.user добавлены id и role из нашей БД.
 * Без этого TypeScript не знает про session.user.role в коде.
 */
import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
