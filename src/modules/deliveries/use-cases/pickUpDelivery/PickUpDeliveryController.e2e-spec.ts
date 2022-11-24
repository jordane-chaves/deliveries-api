import { hash } from 'bcrypt';
import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

interface IAuthenticateResponse {
  token: string;
}

describe('[e2e] Pick Up Delivery', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    await prismaClient.user.create({
      data: {
        name: 'Deliveryman Pick Up Test',
        username: 'deliveryman-pick-up',
        password: passwordHash,
        type: 'deliveryman',
      },
    });
  });

  afterAll(async () => {
    await prismaClient.delivery.deleteMany();
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to pick up a delivery', async () => {
    const delivery = await prismaClient.delivery.create({
      data: {
        item_name: 'Any Delivery to Pick Up',
        location: 'Any Location Test',
        customer: {
          create: {
            name: 'Customer Pick Up Test',
            username: 'customer-pick-up',
            password: 'any-password',
            type: 'customer',
          },
        },
      },
    });

    const responseToken = await request(app).post('/sessions').send({
      username: 'deliveryman-pick-up',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const response = await request(app)
      .patch(`/deliveries/${delivery.id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        item_name: delivery.item_name,
      }),
    );
  });

  it('should not be able to pick up a delivery without being authenticated', async () => {
    const response = await request(app).patch('/deliveries/any-delivery-id');

    expect(response.status).toBe(401);
  });
});
