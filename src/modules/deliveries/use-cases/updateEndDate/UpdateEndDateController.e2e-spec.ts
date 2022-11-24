import { hash } from 'bcrypt';
import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

interface IAuthenticateResponse {
  token: string;
}

describe('[e2e] Update End Date', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    await prismaClient.delivery.create({
      data: {
        item_name: 'Any Delivery to Update End Date',
        location: 'Any Location Test',
        customer: {
          create: {
            name: 'Customer Update End Date',
            username: 'customer-update-end-date',
            password: passwordHash,
            type: 'customer',
          },
        },
        deliveryman: {
          create: {
            name: 'Deliveryman Update End Date',
            username: 'deliveryman-update-end-date',
            password: passwordHash,
            type: 'deliveryman',
          },
        },
      },
    });
  });

  afterAll(async () => {
    await prismaClient.delivery.deleteMany();
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to complete a delivery', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'deliveryman-update-end-date',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const userDeliveriesResponse = await request(app)
      .get('/deliveries')
      .set({
        Authorization: `Bearer ${token}`,
      });

    const delivery = userDeliveriesResponse.body[0];

    const response = await request(app)
      .patch(`/deliveries/${delivery.id}/complete`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.end_at).toBeTruthy();
  });

  it('should not be able to complete a delivery without being authenticated', async () => {
    const response = await request(app).patch(
      '/deliveries/any-delivery-id/complete',
    );

    expect(response.status).toBe(401);
  });
});
