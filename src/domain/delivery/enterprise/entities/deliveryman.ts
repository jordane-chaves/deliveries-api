import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface DeliverymanProps {
  name: string
  email: string
  password: string
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: DeliverymanProps, id?: UniqueEntityID) {
    const deliveryman = new Deliveryman(props, id)

    return deliveryman
  }
}
