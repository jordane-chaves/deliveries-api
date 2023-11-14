import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { Injectable } from '@nestjs/common'

import { PrismaDeliveryMapper } from '../mappers/prisma-delivery-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaDeliveriesRepository implements DeliveriesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Delivery | null> {
    const delivery = await this.prisma.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliveryMapper.toDomain(delivery)
  }

  async findManyByCustomerId(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        ownerId: customerId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        deliverymanId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async findManyAvailable({ page }: PaginationParams): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = await this.prisma.delivery.findMany({
      where: {
        deliverymanId: null,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return deliveries.map(PrismaDeliveryMapper.toDomain)
  }

  async save(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrismaUpdate(delivery)

    await this.prisma.delivery.update(data)
  }

  async create(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.create({
      data,
    })
  }

  async delete(delivery: Delivery): Promise<void> {
    const data = PrismaDeliveryMapper.toPrisma(delivery)

    await this.prisma.delivery.delete({
      where: {
        id: data.id,
      },
    })
  }
}
