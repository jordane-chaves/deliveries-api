import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliverymanDeliveryProps,
  DeliverymanDelivery,
} from '@/domain/delivery/enterprise/entities/deliveryman-delivery'
import { faker } from '@faker-js/faker'

export function makeDeliverymanDelivery(
  override: Partial<DeliverymanDeliveryProps> = {},
  id?: UniqueEntityID,
): DeliverymanDelivery {
  return DeliverymanDelivery.create(
    {
      deliverymanId: new UniqueEntityID(),
      itemName: faker.commerce.product(),
      ...override,
    },
    id,
  )
}
