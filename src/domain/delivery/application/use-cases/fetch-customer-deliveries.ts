import { Either, right } from '@/core/either'

import { CustomerDelivery } from '../../enterprise/entities/customer-delivery'
import { CustomerDeliveriesRepository } from '../repositories/customer-deliveries-repository'

interface FetchCustomerDeliveriesUseCaseRequest {
  customerId: string
  page: number
}

type FetchCustomerDeliveriesUseCaseResponse = Either<
  null,
  { deliveries: CustomerDelivery[] }
>

export class FetchCustomerDeliveriesUseCase {
  constructor(
    private customerDeliveriesRepository: CustomerDeliveriesRepository,
  ) {}

  async execute(
    request: FetchCustomerDeliveriesUseCaseRequest,
  ): Promise<FetchCustomerDeliveriesUseCaseResponse> {
    const { customerId, page } = request

    const deliveries =
      await this.customerDeliveriesRepository.findManyByCustomerId(customerId, {
        page,
      })

    return right({
      deliveries,
    })
  }
}
