import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeliverymanDelivery } from '@/domain/delivery/enterprise/entities/deliveryman-delivery'
import { Prisma, Delivery as PrismaDelivery } from '@prisma/client'

export class PrismaDeliverymanDeliveryMapper {
  static toDomain(raw: PrismaDelivery): DeliverymanDelivery {
    return DeliverymanDelivery.create(
      {
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

  static toPrismaUpdate(
    deliverymanDelivery: DeliverymanDelivery,
  ): Prisma.DeliveryUpdateArgs {
    return {
      where: {
        id: deliverymanDelivery.id.toString(),
      },
      data: {
        itemName: deliverymanDelivery.itemName,
        endAt: deliverymanDelivery.endAt,
      },
    }
  }
}
