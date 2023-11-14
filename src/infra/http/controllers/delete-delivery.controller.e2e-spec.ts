import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Delete delivery (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let customerFactory: CustomerFactory
  let deliveryFactory: DeliveryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)

    await app.init()
  })

  test('[DELETE] /deliveries/:id', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const delivery = await deliveryFactory.makePrismaDelivery({
      ownerId: customer.id,
    })

    const accessToken = jwt.sign({ sub: customer.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/deliveries/${delivery.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const customerDeliveries = await prisma.delivery.findMany({
      where: {
        ownerId: customer.id.toString(),
      },
    })

    expect(customerDeliveries).toHaveLength(0)
  })
})
