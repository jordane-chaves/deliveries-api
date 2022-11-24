import { hash } from 'bcrypt';
import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

interface IAuthenticateResponse {
  token: string;
}

describe('[e2e] List Available Deliveries', () => {
  beforeAll(async () => {
    const passwordHash = await hash('any-password', 10);

    const { id: id_deliveryman } = await prismaClient.user.create({
      data: {
        name: 'Deliveryman List Available',
        username: 'deliveryman-list-available',
        password: passwordHash,
        type: 'deliveryman',
      },
    });

    const { id: id_customer } = await prismaClient.user.create({
      data: {
        name: 'Customer List Available',
        username: 'customer-list-available',
        password: passwordHash,
        type: 'customer',
      },
    });

    await prismaClient.delivery.createMany({
      data: [
        { item_name: 'First Item', location: 'Any Location Test', id_customer },
        {
          item_name: 'Second Item',
          location: 'Any Location Test',
          id_customer,
        },
        {
          item_name: 'Third Item',
          location: 'Any Location Test',
          id_customer,
          id_deliveryman,
        },
        {
          item_name: 'Fourth Item',
          location: 'Any Location Test',
          id_customer,
          id_deliveryman,
        },
      ],
    });
  });

  afterAll(async () => {
    await prismaClient.delivery.deleteMany();
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to list available deliveries', async () => {
    const responseToken = await request(app).post('/sessions').send({
      username: 'deliveryman-list-available',
      password: 'any-password',
    });

    const { token } = responseToken.body as IAuthenticateResponse;

    const response = await request(app)
      .get('/deliveries/available')
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it('should not be able to list available deliveries without being authenticated', async () => {
    const response = await request(app).get('/deliveries/available');

    expect(response.status).toBe(401);
  });
});
