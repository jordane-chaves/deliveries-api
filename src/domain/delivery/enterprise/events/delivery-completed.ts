import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { DeliverymanDelivery } from '../entities/deliveryman-delivery'

export class DeliveryCompletedEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: DeliverymanDelivery

  constructor(delivery: DeliverymanDelivery) {
    this.ocurredAt = new Date()
    this.delivery = delivery
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
