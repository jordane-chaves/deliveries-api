import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'
import { DeliverymanDeliveriesRepository } from '../repositories/deliveryman-deliveries-repository'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'
import { DeliveryUnavailableError } from './errors/delivery-unavailable-error'

interface ChooseDeliveryUseCaseRequest {
  deliverymanId: string
  deliveryId: string
}

type ChooseDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError | DeliveryUnavailableError,
  {
    delivery: DeliverymanDelivery
  }
>

export class ChooseDeliveryUseCase {
  constructor(
    private deliverymanDeliveriesRepository: DeliverymanDeliveriesRepository,
    private deliverymenRepository: DeliverymenRepository,
  ) {}

  async execute(
    request: ChooseDeliveryUseCaseRequest,
  ): Promise<ChooseDeliveryUseCaseResponse> {
    const { deliveryId, deliverymanId } = request

    const deliveryman = await this.deliverymenRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new NotAllowedError())
    }

    const delivery =
      await this.deliverymanDeliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    const deliveryUnavailable = !!delivery.deliverymanId

    if (deliveryUnavailable) {
      return left(new DeliveryUnavailableError())
    }

    delivery.deliverymanId = deliveryman.id

    await this.deliverymanDeliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
