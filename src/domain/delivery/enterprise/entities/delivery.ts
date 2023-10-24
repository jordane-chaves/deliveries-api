import { AggregateRoot } from '@/core/entities/aggregate-root'

export interface DeliveryProps {
  itemName: string
  createdAt: Date
  endAt?: Date | null
}

export abstract class Delivery<
  Props extends DeliveryProps,
> extends AggregateRoot<Props> {
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
}
