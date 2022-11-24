import { hash } from 'bcrypt';
import request from 'supertest';

import { UserTypes } from '@prisma/client';
import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

describe('[e2e] Authenticate User', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    await prismaClient.user.create({
      data: {
        name: 'Customer Auth Test',
        username: 'customer-auth-test',
        password: passwordHash,
        type: 'customer' as UserTypes,
      },
    });
  });

  afterAll(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to authenticate user', async () => {
    const response = await request(app).post('/sessions').send({
      username: 'customer-auth-test',
      password: 'any-password',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should not be able to authenticate user with invalid password', async () => {
    const response = await request(app).post('/sessions').send({
      username: 'customer-auth-test',
      password: 'invalid-password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Username or password incorrect!',
      }),
    );
  });
});
