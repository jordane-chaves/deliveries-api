import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanDeliveriesRepository } from '@/domain/delivery/application/repositories/deliveryman-deliveries-repository'
import { DeliverymanDelivery } from '@/domain/delivery/enterprise/entities/deliveryman-delivery'

export class InMemoryDeliverymanDeliveriesRepository
  implements DeliverymanDeliveriesRepository
{
  public items: DeliverymanDelivery[] = []

  async findById(id: string): Promise<DeliverymanDelivery | null> {
    const delivery = this.items.find((item) => item.id.toString() === id)

    if (!delivery) {
      return null
    }

    return delivery
  }

  async findManyAvailable({
    page,
  }: PaginationParams): Promise<DeliverymanDelivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.deliverymanId === null)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async findManyByDeliverymanId(
    deliverymanId: string,
    { page }: PaginationParams,
  ): Promise<DeliverymanDelivery[]> {
    const perPage = 20

    const deliveries = this.items
      .filter((item) => item.deliverymanId?.toString() === deliverymanId)
      .slice((page - 1) * perPage, page * perPage)

    return deliveries
  }

  async save(delivery: DeliverymanDelivery): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(delivery.id),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = delivery

      DomainEvents.dispatchEventsForAggregate(delivery.id)
    }
  }
}
