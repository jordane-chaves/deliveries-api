import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { DeliverymanFactory } from '@/test/factories/make-deliveryman'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Choose delivery (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    customerFactory = moduleRef.get(CustomerFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[PATCH] /deliveries/:id/choose', async () => {
    const customer = await customerFactory.makePrismaCustomer()

    const delivery = await deliveryFactory.makePrismaDelivery({
      ownerId: customer.id,
    })

    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: ['Deliveryman'],
    })

    const response = await request(app.getHttpServer())
      .patch(`/deliveries/${delivery.id.toString()}/choose`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deliveryOnDatabase = await prisma.delivery.findFirst({
      where: {
        id: delivery.id.toString(),
      },
    })

    expect(deliveryOnDatabase).toEqual(
      expect.objectContaining({
        deliverymanId: deliveryman.id.toString(),
      }),
    )
  })
})
