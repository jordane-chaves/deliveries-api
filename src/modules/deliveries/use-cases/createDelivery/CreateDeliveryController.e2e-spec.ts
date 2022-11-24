import { hash } from 'bcrypt';
import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

interface IAuthenticateResponse {
  token: string;
}

describe('[e2e] Create Delivery', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    await prismaClient.user.create({
      data: {
        name: 'Customer Create Delivery',
        username: 'customer-create-delivery',
        password: passwordHash,
        type: 'customer',
      },
    });
  });

  afterAll(async () => {
    await prismaClient.delivery.deleteMany();
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to create a new delivery', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'customer-create-delivery',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const response = await request(app)
      .post('/deliveries')
      .send({
        item_name: 'New Delivery Name',
        location: 'Any Location Test',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able to create a new delivery without being authenticated', async () => {
    const response = await request(app).post('/deliveries').send({
      item_name: 'Any Delivery Name',
    });

    expect(response.status).toBe(401);
  });
});
