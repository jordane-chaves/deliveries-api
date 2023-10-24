import { CustomersRepository } from '@/domain/delivery/application/repositories/customers-repository'
import { Customer } from '@/domain/delivery/enterprise/entities/customer'

export class InMemoryCustomersRepository implements CustomersRepository {
  public items: Customer[] = []

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.items.find((item) => item.email === email)

    if (!customer) {
      return null
    }

    return customer
  }

  async create(customer: Customer): Promise<void> {
    this.items.push(customer)
  }
}
