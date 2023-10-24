import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  CustomerDeliveryProps,
  CustomerDelivery,
} from '@/domain/delivery/enterprise/entities/customer-delivery'
import { faker } from '@faker-js/faker'

export function makeCustomerDelivery(
  override: Partial<CustomerDeliveryProps> = {},
  id?: UniqueEntityID,
): CustomerDelivery {
  return CustomerDelivery.create(
    {
      customerId: new UniqueEntityID(),
      itemName: faker.commerce.product(),
      ...override,
    },
    id,
  )
}
