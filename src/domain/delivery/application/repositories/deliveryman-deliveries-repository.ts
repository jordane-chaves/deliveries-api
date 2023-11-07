import { PaginationParams } from '@/core/repositories/pagination-params'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'

export abstract class DeliverymanDeliveriesRepository {
  abstract findById(id: string): Promise<DeliverymanDelivery | null>
  abstract findManyAvailable(
    params: PaginationParams,
  ): Promise<DeliverymanDelivery[]>

  abstract findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<DeliverymanDelivery[]>

  abstract save(delivery: DeliverymanDelivery): Promise<void>
}
