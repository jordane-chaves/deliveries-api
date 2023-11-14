import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'
import { Delivery as PrismaDelivery, Prisma } from '@prisma/client'

export class PrismaDeliveryMapper {
  static toDomain(raw: PrismaDelivery): Delivery {
    return Delivery.create(
      {
        ownerId: new UniqueEntityID(raw.ownerId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityID(raw.deliverymanId)
          : null,
        itemName: raw.itemName,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(delivery: Delivery): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: delivery.id.toString(),
      ownerId: delivery.ownerId.toString(),
      deliverymanId: delivery.deliverymanId?.toString(),
      itemName: delivery.itemName,
      createdAt: delivery.createdAt,
      endAt: delivery.endAt,
    }
  }

  static toPrismaUpdate(delivery: Delivery): Prisma.DeliveryUpdateArgs {
    return {
      where: {
        id: delivery.id.toString(),
      },
      data: {
        deliverymanId: delivery.deliverymanId?.toString(),
        itemName: delivery.itemName,
        endAt: delivery.endAt,
      },
    }
  }
}
