import { PaginationParams } from '@/core/repositories/pagination-params'
import { CustomerDeliveriesRepository } from '@/domain/delivery/application/repositories/customer-deliveries-repository'
import { CustomerDelivery } from '@/domain/delivery/enterprise/entities/customer-delivery'
import { Injectable } from '@nestjs/common'

import { PrismaCustomerDeliveryMapper } from '../mappers/prisma-customer-delivery-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomerDeliveriesRepository
  implements CustomerDeliveriesRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<CustomerDelivery> {
    const customerDelivery = await this.prismaService.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!customerDelivery) {
      return null
    }

    return PrismaCustomerDeliveryMapper.toDomain(customerDelivery)
  }

  async findManyByCustomerId(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<CustomerDelivery[]> {
    const perPage = 20

    const customerDeliveries = await this.prismaService.delivery.findMany({
      where: {
        ownerId: customerId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return customerDeliveries.map(PrismaCustomerDeliveryMapper.toDomain)
  }

  async save(customerDelivery: CustomerDelivery): Promise<void> {
    const data = PrismaCustomerDeliveryMapper.toPrisma(customerDelivery)

    await this.prismaService.delivery.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(customerDelivery: CustomerDelivery): Promise<void> {
    const data = PrismaCustomerDeliveryMapper.toPrisma(customerDelivery)

    await this.prismaService.delivery.create({
      data,
    })
  }

  async delete(customerDelivery: CustomerDelivery): Promise<void> {
    const data = PrismaCustomerDeliveryMapper.toPrisma(customerDelivery)

    await this.prismaService.delivery.delete({
      where: {
        id: data.id,
      },
    })
  }
}
