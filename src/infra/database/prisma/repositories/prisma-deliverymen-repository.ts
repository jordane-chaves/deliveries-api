import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { Injectable } from '@nestjs/common'

import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
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
