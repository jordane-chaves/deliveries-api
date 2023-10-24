import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'
import { DeliverymanDeliveriesRepository } from '../repositories/deliveryman-deliveries-repository'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface FetchAvailableDeliveriesUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchAvailableDeliveriesUseCaseResponse = Either<
  NotAllowedError,
  { deliveries: DeliverymanDelivery[] }
>

export class FetchAvailableDeliveriesUseCase {
  constructor(
    private deliverymanDeliveriesRepository: DeliverymanDeliveriesRepository,
    private deliverymenRepository: DeliverymenRepository,
  ) {}

  async execute(
    request: FetchAvailableDeliveriesUseCaseRequest,
  ): Promise<FetchAvailableDeliveriesUseCaseResponse> {
    const { deliverymanId, page } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new NotAllowedError())
    }

    const deliveries =
      await this.deliverymanDeliveriesRepository.findManyAvailable({ page })

    return right({
      deliveries,
    })
  }
}
