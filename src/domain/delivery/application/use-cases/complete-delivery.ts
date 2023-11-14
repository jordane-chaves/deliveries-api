import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface CompleteDeliveryUseCaseRequest {
  deliverymanId: string
  deliveryId: string
}

type CompleteDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    delivery: Delivery
  }
>

export class CompleteDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: CompleteDeliveryUseCaseRequest,
  ): Promise<CompleteDeliveryUseCaseResponse> {
    const { deliveryId, deliverymanId } = request

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== delivery.deliverymanId?.toString()) {
      return left(new NotAllowedError())
    }

    delivery.complete()

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
