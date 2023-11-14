import { CustomersRepository } from '@/domain/account/application/repositories/customers-repository'
import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { PrismaDeliveriesRepository } from './prisma/repositories/prisma-deliveries-repository'
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: DeliveriesRepository,
      useClass: PrismaDeliveriesRepository,
    },
    {
      provide: DeliverymenRepository,
      useClass: PrismaDeliverymenRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    CustomersRepository,
    DeliveriesRepository,
    DeliverymenRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
