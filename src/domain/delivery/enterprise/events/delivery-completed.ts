import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

import { Delivery } from '../entities/delivery'

export class DeliveryCompletedEvent implements DomainEvent {
  public ocurredAt: Date
  public delivery: Delivery

  constructor(delivery: Delivery) {
    this.ocurredAt = new Date()
    this.delivery = delivery
  }

  getAggregateId(): UniqueEntityID {
    return this.delivery.id
  }
}
