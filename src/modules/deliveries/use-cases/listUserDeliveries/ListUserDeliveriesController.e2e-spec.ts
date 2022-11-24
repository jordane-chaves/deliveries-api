import { hash } from 'bcrypt';
import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

interface IAuthenticateResponse {
  token: string;
}

describe('[e2e] List User Deliveries', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    const customer = await prismaClient.user.create({
      data: {
        name: 'Customer List Deliveries',
        username: 'customer-list-deliveries',
        password: passwordHash,
        type: 'customer',
      },
    });

    const deliveryman = await prismaClient.user.create({
      data: {
        name: 'Deliveryman List Deliveries',
        username: 'deliveryman-list-deliveries',
        password: passwordHash,
        type: 'deliveryman',
      },
    });

    await prismaClient.delivery.createMany({
      data: [
        {
          item_name: 'First Item Test',
          location: 'Any Location Test',
          id_customer: customer.id,
          id_deliveryman: deliveryman.id,
        },
        {
          item_name: 'Second Item Test',
          location: 'Any Location Test',
          id_customer: customer.id,
        },
        {
          item_name: 'Third Item Test',
          location: 'Any Location Test',
          id_customer: customer.id,
        },
        {
          item_name: 'Fourth Item Test',
          location: 'Any Location Test',
          id_customer: customer.id,
        },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.delivery.deleteMany();
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to list all customer deliveries', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'customer-list-deliveries',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const response = await request(app)
      .get('/deliveries')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
  });

  it('should be able to list all deliveryman deliveries', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'deliveryman-list-deliveries',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const response = await request(app)
      .get('/deliveries')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('should not be able to list deliveries without being authenticated', async () => {
    const response = await request(app).get('/deliveries');

    expect(response.status).toBe(401);
  });
});
