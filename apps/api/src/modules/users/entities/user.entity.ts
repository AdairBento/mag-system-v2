import { UserRole, UserStatus } from '@prisma/client';

export class User {
  id!: string;
  email!: string;
  name!: string;
  role!: UserRole;
  status!: UserStatus;

  failedLoginAttempts!: number;
  lockedUntil!: Date | null;
  lastLoginAt!: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date | null;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
