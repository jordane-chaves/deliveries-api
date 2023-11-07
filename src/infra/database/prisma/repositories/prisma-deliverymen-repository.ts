import { DeliverymenRepository } from '@/domain/delivery/application/repositories/deliverymen-repository'
import { Deliveryman } from '@/domain/delivery/enterprise/entities/deliveryman'

import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { PrismaService } from '../prisma.service'

export class PrismaDeliverymenRepository implements DeliverymenRepository {
  constructor(private prismaService: PrismaService) {}

  async findByEmail(email: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prismaService.user.create({
      data,
    })
  }
}
