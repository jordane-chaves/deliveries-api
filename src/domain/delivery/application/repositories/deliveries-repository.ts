import { PaginationParams } from '@/core/repositories/pagination-params'

import { Delivery } from '../../enterprise/entities/delivery'

export abstract class DeliveriesRepository {
  abstract findById(id: string): Promise<Delivery | null>
  abstract findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<Delivery[]>

  abstract findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<Delivery[]>

  abstract findManyAvailable(params: PaginationParams): Promise<Delivery[]>

  abstract save(delivery: Delivery): Promise<void>
  abstract create(delivery: Delivery): Promise<void>
  abstract delete(delivery: Delivery): Promise<void>
}
