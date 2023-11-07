import { CustomerDeliveriesRepository } from '@/domain/delivery/application/repositories/customer-deliveries-repository'
import { CustomersRepository } from '@/domain/delivery/application/repositories/customers-repository'
import { DeliverymanDeliveriesRepository } from '@/domain/delivery/application/repositories/deliveryman-deliveries-repository'
import { DeliverymenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaCustomerDeliveriesRepository } from './prisma/repositories/prisma-customer-deliveries-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { PrismaDeliverymanDeliveriesRepository } from './prisma/repositories/prisma-deliveryman-deliveries-repository'
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: CustomerDeliveriesRepository,
      useClass: PrismaCustomerDeliveriesRepository,
    },
    {
      provide: DeliverymenRepository,
      useClass: PrismaDeliverymenRepository,
    },
    {
      provide: DeliverymanDeliveriesRepository,
      useClass: PrismaDeliverymanDeliveriesRepository,
    },
  ],
  exports: [
    PrismaService,
    CustomersRepository,
    CustomerDeliveriesRepository,
    DeliverymenRepository,
    DeliverymanDeliveriesRepository,
  ],
})
export class DatabaseModule {}
