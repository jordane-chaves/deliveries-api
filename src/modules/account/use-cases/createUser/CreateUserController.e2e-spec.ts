import request from 'supertest';

import { app } from '@shared/infra/http/app';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

describe('[e2e] Create User', () => {
  afterAll(async () => {
    await prismaClient.user.deleteMany();

    await prismaClient.$disconnect();
  });

  it('should be able to create a new Customer', async () => {
    const response = await request(app).post('/users/customer').send({
      name: 'New Customer Test',
      username: 'new-customer-test',
      password: 'any-password',
    });

    expect(response.status).toBe(201);
  });

  it('should be able to create a new Deliveryman', async () => {
    const response = await request(app).post('/users/deliveryman').send({
      name: 'New Deliveryman Test',
      username: 'new-deliveryman-test',
      password: 'any-password',
    });

    expect(response.status).toBe(201);
  });
});
