import { PaginationParams } from '@/core/repositories/pagination-params'

import { CustomerDelivery } from '../../enterprise/entities/customer-delivery'

export interface CustomerDeliveriesRepository {
  findById(id: string): Promise<CustomerDelivery | null>
  findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<CustomerDelivery[]>
  save(customerDelivery: CustomerDelivery): Promise<void>
  create(customerDelivery: CustomerDelivery): Promise<void>
  delete(customerDelivery: CustomerDelivery): Promise<void>
}
