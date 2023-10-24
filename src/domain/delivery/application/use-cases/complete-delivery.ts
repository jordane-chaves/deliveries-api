import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeliverymanDelivery } from '../../enterprise/entities/deliveryman-delivery'
import { DeliverymanDeliveriesRepository } from '../repositories/deliveryman-deliveries-repository'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'

interface CompleteDeliveryUseCaseRequest {
  deliverymanId: string
  deliveryId: string
}

type CompleteDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    delivery: DeliverymanDelivery
  }
>

export class CompleteDeliveryUseCase {
  constructor(
    private deliverymanDeliveriesRepository: DeliverymanDeliveriesRepository,
    private deliverymenRepository: DeliverymenRepository,
  ) {}

  async execute(
    request: CompleteDeliveryUseCaseRequest,
  ): Promise<CompleteDeliveryUseCaseResponse> {
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

    const isSameDeliveryman =
      delivery.deliverymanId && delivery.deliverymanId.equals(deliveryman.id)

    if (!isSameDeliveryman) {
      return left(new NotAllowedError())
    }

    delivery.complete()

    await this.deliverymanDeliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
