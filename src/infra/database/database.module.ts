import { CustomerDeliveriesRepository } from '@/domain/delivery/application/repositories/customer-deliveries-repository'
import { CustomersRepository } from '@/domain/delivery/application/repositories/customers-repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaCustomerDeliveriesRepository } from './prisma/repositories/prisma-customer-deliveries-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'

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
  ],
  exports: [PrismaService, CustomersRepository, CustomerDeliveriesRepository],
})
export class DatabaseModule {}
