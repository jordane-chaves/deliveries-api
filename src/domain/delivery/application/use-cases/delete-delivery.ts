import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryInProgressError } from './errors/delivery-in-progress-error'

interface DeleteDeliveryUseCaseRequest {
  customerId: string
  deliveryId: string
}

type DeleteDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | DeliveryInProgressError,
  null
>

@Injectable()
export class DeleteDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: DeleteDeliveryUseCaseRequest,
  ): Promise<DeleteDeliveryUseCaseResponse> {
    const { customerId, deliveryId } = request

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== delivery.ownerId.toString()) {
      return left(new NotAllowedError())
    }

    const deliveryUnavailable = !!delivery.deliverymanId

    if (deliveryUnavailable) {
      return left(new DeliveryInProgressError())
    }

    await this.deliveriesRepository.delete(delivery)

    return right(null)
  }
}
