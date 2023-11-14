import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@prisma/client/runtime/library'

import { DeliveryCompletedEvent } from '../events/delivery-completed'

export interface DeliveryProps {
  ownerId: UniqueEntityID
  deliverymanId?: UniqueEntityID | null
  itemName: string
  createdAt: Date
  endAt?: Date | null
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get ownerId() {
    return this.props.ownerId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  set deliverymanId(deliverymanId: UniqueEntityID | null | undefined) {
    this.props.deliverymanId = deliverymanId
  }

  get itemName() {
    return this.props.itemName
  }

  set itemName(itemName: string) {
    this.props.itemName = itemName
  }

  get createdAt() {
    return this.props.createdAt
  }

  get endAt() {
    return this.props.endAt
  }

  complete() {
    if (!this.endAt) {
      this.addDomainEvent(new DeliveryCompletedEvent(this))
    }

    this.props.endAt = new Date()
  }

  static create(
    props: Optional<DeliveryProps, 'deliverymanId' | 'createdAt' | 'endAt'>,
    id?: UniqueEntityID,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return delivery
  }
}
