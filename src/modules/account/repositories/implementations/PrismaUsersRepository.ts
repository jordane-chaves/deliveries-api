import { User } from '@modules/account/entities/User';
import { ICreateUserDTO } from '@modules/account/use-cases/createUser/ICreateUserDTO';
import { Prisma } from '@prisma/client';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

import { IUsersRepository } from '../IUsersRepository';

export class PrismaUsersRepository implements IUsersRepository {
  private repository: Prisma.UserDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor() {
    this.repository = prismaClient.user;
  }

  async create({
    name,
    password,
    type,
    username,
  }: ICreateUserDTO): Promise<User> {
    const user = await this.repository.create({
      data: {
        name,
        password,
        username,
        type,
      },
    });

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.repository.findMany({
      where: {
        username,
      },
    });

    return user[0];
  }

  async findById(id: string): Promise<User> {
    const user = await this.repository.findUnique({ where: { id } });

    return user;
  }
}
