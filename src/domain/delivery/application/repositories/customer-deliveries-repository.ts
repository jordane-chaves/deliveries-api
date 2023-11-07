import { PaginationParams } from '@/core/repositories/pagination-params'

import { CustomerDelivery } from '../../enterprise/entities/customer-delivery'

export abstract class CustomerDeliveriesRepository {
  abstract findById(id: string): Promise<CustomerDelivery | null>
  abstract findManyByCustomerId(
    customerId: string,
    params: PaginationParams,
  ): Promise<CustomerDelivery[]>

  abstract save(customerDelivery: CustomerDelivery): Promise<void>
  abstract create(customerDelivery: CustomerDelivery): Promise<void>
  abstract delete(customerDelivery: CustomerDelivery): Promise<void>
}
