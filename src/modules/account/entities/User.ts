import crypto from 'crypto';

import { User as PrismaUser } from '@prisma/client';

type UserTypes = 'customer' | 'deliveryman';

export class User implements PrismaUser {
  id: string;

  name: string;
  username: string;
  password: string;
  type: UserTypes;

  constructor() {
    this.id = this.id ?? crypto.randomUUID();
  }
}
