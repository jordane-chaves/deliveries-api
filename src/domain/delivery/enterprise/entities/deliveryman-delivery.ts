import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { DeliveryCompletedEvent } from '../events/delivery-completed'
import { Delivery, DeliveryProps } from './delivery'

export interface DeliverymanDeliveryProps extends DeliveryProps {
  deliverymanId?: UniqueEntityID | null
}

export class DeliverymanDelivery extends Delivery<DeliverymanDeliveryProps> {
  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: UniqueEntityID | null | undefined) {
    this.props.deliverymanId = deliverymanId
  }

  complete() {
    if (!this.endAt) {
      this.addDomainEvent(new DeliveryCompletedEvent(this))
    }

    this.props.endAt = new Date()
  }

  static create(
    props: Optional<DeliverymanDeliveryProps, 'createdAt' | 'endAt'>,
    id?: UniqueEntityID,
  ) {
    const deliverymanDelivery = new DeliverymanDelivery(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliverymanDelivery
  }
}
