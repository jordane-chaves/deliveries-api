import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryProps,
  Delivery,
} from '@/domain/delivery/enterprise/entities/delivery'
import { PrismaDeliveryMapper } from '@/infra/database/prisma/mappers/prisma-delivery-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeDelivery(
  override: Partial<DeliveryProps> = {},
  id?: UniqueEntityID,
): Delivery {
  return Delivery.create(
    {
      ownerId: new UniqueEntityID(),
      itemName: faker.commerce.product(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class DeliveryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDelivery(data: Partial<DeliveryProps> = {}) {
    const delivery = makeDelivery(data)

    await this.prisma.delivery.create({
      data: PrismaDeliveryMapper.toPrisma(delivery),
    })

    return delivery
  }
}
