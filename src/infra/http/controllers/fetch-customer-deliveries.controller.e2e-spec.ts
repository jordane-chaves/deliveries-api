import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch customer deliveries (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let customerFactory: CustomerFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    await app.init()
  })

  test('[GET] /deliveries', async () => {
    const user = await customerFactory.makePrismaCustomer()

    const delivery1 = await deliveryFactory.makePrismaDelivery({
      ownerId: user.id,
    })

    const delivery2 = await deliveryFactory.makePrismaDelivery({
      ownerId: user.id,
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .get('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveries: expect.arrayContaining([
        expect.objectContaining({ itemName: delivery1.itemName }),
        expect.objectContaining({ itemName: delivery2.itemName }),
      ]),
    })
  })
})
