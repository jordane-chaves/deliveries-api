import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { DeliverymanFactory } from '@/test/factories/make-deliveryman'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch deliveryman deliveries (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let customerFactory: CustomerFactory
  let deliverymanFactory: DeliverymanFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, DeliverymanFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    await app.init()
  })

  test('[GET] /deliveries/deliveryman', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    await Promise.all([
      deliveryFactory.makePrismaDelivery({
        ownerId: customer.id,
        deliverymanId: deliveryman.id,
      }),
      deliveryFactory.makePrismaDelivery({
        ownerId: customer.id,
        deliverymanId: deliveryman.id,
      }),
    ])

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/deliveries/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({ deliverymanId: deliveryman.id.toString() }),
        expect.objectContaining({ deliverymanId: deliveryman.id.toString() }),
      ]),
    })
  })
})
