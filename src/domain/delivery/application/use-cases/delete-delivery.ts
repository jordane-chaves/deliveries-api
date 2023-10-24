import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { CustomerDeliveriesRepository } from '../repositories/customer-deliveries-repository'
import { DeliverymanDeliveriesRepository } from '../repositories/deliveryman-deliveries-repository'
import { DeliveryInProgressError } from './errors/delivery-in-progress-error'

interface DeleteDeliveryUseCaseRequest {
  customerId: string
  deliveryId: string
}

type DeleteDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | DeliveryInProgressError,
  null
>

export class DeleteDeliveryUseCase {
  constructor(
    private customerDeliveriesRepository: CustomerDeliveriesRepository,
    private deliverymanDeliveriesRepository: DeliverymanDeliveriesRepository,
  ) {}

  async execute(
    request: DeleteDeliveryUseCaseRequest,
  ): Promise<DeleteDeliveryUseCaseResponse> {
    const { customerId, deliveryId } = request

    const delivery =
      await this.customerDeliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== delivery.customerId.toString()) {
      return left(new NotAllowedError())
    }

    const deliverymanDelivery =
      await this.deliverymanDeliveriesRepository.findById(deliveryId)

    const isDeliveryInProgress = !!deliverymanDelivery?.deliverymanId

    if (isDeliveryInProgress) {
      return left(new DeliveryInProgressError())
    }

    await this.customerDeliveriesRepository.delete(delivery)

    return right(null)
  }
}
