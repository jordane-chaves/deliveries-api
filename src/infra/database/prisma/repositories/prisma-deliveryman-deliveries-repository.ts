import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanDeliveriesRepository } from '@/domain/delivery/application/repositories/deliveryman-deliveries-repository'
import { DeliverymanDelivery } from '@/domain/delivery/enterprise/entities/deliveryman-delivery'

import { PrismaDeliverymanDeliveryMapper } from '../mappers/prisma-deliveryman-delivery-mapper'
import { PrismaService } from '../prisma.service'

export class PrismaDeliverymanDeliveriesRepository
  implements DeliverymanDeliveriesRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(id: string): Promise<DeliverymanDelivery | null> {
    const delivery = await this.prismaService.delivery.findUnique({
      where: {
        id,
      },
    })

    if (!delivery) {
      return null
    }

    return PrismaDeliverymanDeliveryMapper.toDomain(delivery)
  }

  async findManyAvailable({
    page,
  }: PaginationParams): Promise<DeliverymanDelivery[]> {
    const perPage = 20

    const deliveries = await this.prismaService.delivery.findMany({
      where: {
        deliverymanId: null,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return deliveries.map(PrismaDeliverymanDeliveryMapper.toDomain)
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<DeliverymanDelivery[]> {
    const perPage = 20

    const deliveries = await this.prismaService.delivery.findMany({
      where: {
        deliverymanId,
      },
      take: perPage,
      skip: (page - 1) * perPage,
    })

    return deliveries.map(PrismaDeliverymanDeliveryMapper.toDomain)
  }

  async save(delivery: DeliverymanDelivery): Promise<void> {
    const data = PrismaDeliverymanDeliveryMapper.toPrismaUpdate(delivery)

    await this.prismaService.delivery.update(data)
  }
}
