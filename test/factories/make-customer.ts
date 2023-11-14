import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Customer,
  CustomerProps,
} from '@/domain/account/enterprise/entities/customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCustomer(
  override: Partial<CustomerProps> = {},
  id?: UniqueEntityID,
): Customer {
  return Customer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(
    data: Partial<CustomerProps> = {},
  ): Promise<Customer> {
    const customer = makeCustomer(data)

    await this.prisma.user.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
