import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { CustomerFactory } from '@/test/factories/make-customer'
import { NotificationFactory } from '@/test/factories/make-notification'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Read notification (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let customerFactory: CustomerFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    customerFactory = moduleRef.get(CustomerFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[PATCH] /notifications/:id/read', async () => {
    const user = await customerFactory.makePrismaCustomer()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    })

    const notificationId = notification.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const notificationOnDatabase = await prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
    })

    expect(notificationOnDatabase).toEqual(
      expect.objectContaining({
        readAt: expect.any(Date),
      }),
    )
  })
})
