import request from 'supertest'

import { HashGenerator } from '@/domain/account/application/cryptography/hash-generator'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

describe('Authenticate deliveryman (E2E)', () => {
  let app: INestApplication
  let hashGenerator: HashGenerator
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    hashGenerator = moduleRef.get(HashGenerator)
    customerFactory = moduleRef.get(CustomerFactory)

    await app.init()
  })

  test('[POST] /deliveryman/sessions', async () => {
    await customerFactory.makePrismaCustomer({
      email: 'johndoe@example.com',
      password: await hashGenerator.hash('123456'),
    })

    const response = await request(app.getHttpServer())
      .post('/deliveryman/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
