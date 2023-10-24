import { Either, right } from '@/core/either'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'
import { DeliverymanDeliveriesRepository } from '../repositories/deliveryman-deliveries-repository'

interface FetchDeliverymanDeliveriesUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchDeliverymanDeliveriesUseCaseResponse = Either<
  null,
  {
    deliveries: DeliverymanDelivery[]
  }
>

export class FetchDeliverymanDeliveriesUseCase {
  constructor(
    private deliverymanDeliveriesRepository: DeliverymanDeliveriesRepository,
  ) {}

  async execute(
    request: FetchDeliverymanDeliveriesUseCaseRequest,
  ): Promise<FetchDeliverymanDeliveriesUseCaseResponse> {
    const { deliverymanId, page } = request

    const deliveries =
      await this.deliverymanDeliveriesRepository.findManyByDeliverymanId(
        deliverymanId,
        { page },
      )

    return right({
      deliveries,
    })
  }
}
