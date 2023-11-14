import request from 'supertest'

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'
import { DeliveryFactory } from '@/test/factories/make-delivery'
import { DeliverymanFactory } from '@/test/factories/make-deliveryman'
import { waitFor } from '@/test/utils/wait-for'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('On complete delivery (E2E)', () => {
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

    DomainEvents.shouldRun = true

    await app.init()
  })

  test('[PATCH] /deliveries/:id/complete', async () => {
    const customer = await customerFactory.makePrismaCustomer()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const delivery = await deliveryFactory.makePrismaDelivery({
      ownerId: customer.id,
      deliverymanId: deliveryman.id,
    })

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      roles: ['Deliveryman'],
    })

    await request(app.getHttpServer())
      .patch(`/deliveries/${delivery.id.toString()}/complete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: customer.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
