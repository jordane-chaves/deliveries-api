import { PaginationParams } from '@/core/repositories/pagination-params'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'

export interface DeliverymanDeliveriesRepository {
  findById(id: string): Promise<DeliverymanDelivery | null>
  findManyAvailable(params: PaginationParams): Promise<DeliverymanDelivery[]>
  findManyByDeliverymanId(
    deliverymanId: string,
    params: PaginationParams,
  ): Promise<DeliverymanDelivery[]>
  save(delivery: DeliverymanDelivery): Promise<void>
}
