import { PaginationParams } from '@/core/repositories/pagination-params'
import { CustomerDeliveriesRepository } from '@/domain/delivery/application/repositories/customer-deliveries-repository'
import { CustomerDelivery } from '@/domain/delivery/enterprise/entities/customer-delivery'

export class InMemoryCustomerDeliveriesRepository
  implements CustomerDeliveriesRepository
{
  public items: CustomerDelivery[] = []

  async findById(id: string): Promise<CustomerDelivery | null> {
    const customerDelivery = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!customerDelivery) {
      return null
    }

    return customerDelivery
  }

  async findManyByCustomerId(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<CustomerDelivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.customerId.toString() === customerId)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async save(customerDelivery: CustomerDelivery): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(customerDelivery.id),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = customerDelivery
    }
  }

  async create(customerDelivery: CustomerDelivery): Promise<void> {
    this.items.push(customerDelivery)
  }

  async delete(customerDelivery: CustomerDelivery): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(customerDelivery.id),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
