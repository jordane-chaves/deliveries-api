import { CustomersRepository } from '@/domain/account/application/repositories/customers-repository'
import { Customer } from '@/domain/account/enterprise/entities/customer'
import { Injectable } from '@nestjs/common'

import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.user.create({
      data,
    })
  }
}
