import { CustomersRepository } from '@/domain/delivery/application/repositories/customers-repository'
import { Customer } from '@/domain/delivery/enterprise/entities/customer'
import { Injectable } from '@nestjs/common'

import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prismaService.user.findUnique({
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

    await this.prismaService.user.create({
      data,
    })
  }
}
