import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CustomerDelivery } from '@/domain/delivery/enterprise/entities/customer-delivery'
import { Delivery as PrismaDelivery, Prisma } from '@prisma/client'

export class PrismaCustomerDeliveryMapper {
  static toDomain(raw: PrismaDelivery): CustomerDelivery {
    return CustomerDelivery.create(
      {
        customerId: new UniqueEntityID(raw.ownerId),
        itemName: raw.itemName,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    customerDelivery: CustomerDelivery,
  ): Prisma.DeliveryUncheckedCreateInput {
    return {
      id: customerDelivery.id.toString(),
      ownerId: customerDelivery.customerId.toString(),
      itemName: customerDelivery.itemName,
      createdAt: customerDelivery.createdAt,
      endAt: customerDelivery.endAt,
    }
  }
}
