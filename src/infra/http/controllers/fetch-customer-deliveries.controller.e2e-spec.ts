import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CustomerFactory } from '@/test/factories/make-customer'
import { CustomerDeliveryFactory } from '@/test/factories/make-customer-delivery'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch customer deliveries (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let customerFactory: CustomerFactory
  let customerDeliveryFactory: CustomerDeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, CustomerDeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    customerDeliveryFactory = moduleRef.get(CustomerDeliveryFactory)

    await app.init()
  })

  test('[GET] /deliveries', async () => {
    const user = await customerFactory.makePrismaCustomer()

    const delivery1 = await customerDeliveryFactory.makeCustomerDelivery({
      customerId: user.id,
    })

    const delivery2 = await customerDeliveryFactory.makeCustomerDelivery({
      customerId: user.id,
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
