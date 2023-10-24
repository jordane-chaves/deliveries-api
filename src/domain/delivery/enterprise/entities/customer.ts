import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CustomerProps {
  name: string
  email: string
  password: string
}

export class Customer extends Entity<CustomerProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(props, id)

    return customer
  }
}
