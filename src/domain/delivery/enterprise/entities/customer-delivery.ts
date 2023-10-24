import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { Delivery, DeliveryProps } from './delivery'

export interface CustomerDeliveryProps extends DeliveryProps {
  customerId: UniqueEntityID
}

export class CustomerDelivery extends Delivery<CustomerDeliveryProps> {
  get customerId() {
    return this.props.customerId
  }

  static create(
    props: Optional<CustomerDeliveryProps, 'createdAt' | 'endAt'>,
    id?: UniqueEntityID,
  ) {
    const customerDelivery = new CustomerDelivery(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return customerDelivery
  }
}
