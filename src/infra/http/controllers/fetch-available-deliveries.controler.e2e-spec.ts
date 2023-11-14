import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { DeliverymanFactory } from '@/test/factories/make-deliveryman'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch available deliveries (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let customerFactory: CustomerFactory
  let deliveryFactory: DeliveryFactory
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, DeliveryFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[GET] /deliveries/available', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    await Promise.all([
      deliveryFactory.makePrismaDelivery({ ownerId: customer.id }),
      deliveryFactory.makePrismaDelivery({ ownerId: customer.id }),
      deliveryFactory.makePrismaDelivery({ ownerId: customer.id }),
    ])

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/deliveries/available')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({
          ownerId: customer.id.toString(),
          deliverymanId: null,
        }),
        expect.objectContaining({
          ownerId: customer.id.toString(),
          deliverymanId: null,
        }),
        expect.objectContaining({
          ownerId: customer.id.toString(),
          deliverymanId: null,
        }),
      ]),
    })
  })
})
