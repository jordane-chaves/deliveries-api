import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomerDeliveryProps,
  CustomerDelivery,
} from '@/domain/delivery/enterprise/entities/customer-delivery'
import { PrismaCustomerDeliveryMapper } from '@/infra/database/prisma/mappers/prisma-customer-delivery-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCustomerDelivery(
  override: Partial<CustomerDeliveryProps> = {},
  id?: UniqueEntityID,
): CustomerDelivery {
  return CustomerDelivery.create(
    {
      customerId: new UniqueEntityID(),
      itemName: faker.commerce.product(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class CustomerDeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makeCustomerDelivery(
    data: Partial<CustomerDeliveryProps> = {},
  ): Promise<CustomerDelivery> {
    const customerDelivery = makeCustomerDelivery(data)

    await this.prisma.delivery.create({
      data: PrismaCustomerDeliveryMapper.toPrisma(customerDelivery),
    })

    return customerDelivery
  }
}
