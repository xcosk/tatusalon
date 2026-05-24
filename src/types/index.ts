import type { Role, BookingStatus, ContactStatus } from "@prisma/client";

export type { Role, BookingStatus, ContactStatus };

export type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  image?: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
