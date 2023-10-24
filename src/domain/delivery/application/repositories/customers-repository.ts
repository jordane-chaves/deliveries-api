import { Customer } from '../../enterprise/entities/customer'

export interface CustomersRepository {
  findByEmail(email: string): Promise<Customer | null>
  create(customer: Customer): Promise<void>
}
