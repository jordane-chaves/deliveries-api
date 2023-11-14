import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

export class InMemoryDeliveriesRepository implements DeliveriesRepository {
  public items: Delivery[] = []

  async findById(id: string): Promise<Delivery | null> {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async findManyByCustomerId(
    customerId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.ownerId.toString() === customerId)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.deliverymanId?.toString() === deliverymanId)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async findManyAvailable({ page }: PaginationParams): Promise<Delivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.deliverymanId === null)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async save(delivery: Delivery): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = delivery

      DomainEvents.dispatchEventsForAggregate(delivery.id)
    }
  }

  async create(delivery: Delivery): Promise<void> {
    this.items.push(delivery)
  }

  async delete(delivery: Delivery): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
