import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { CustomerDelivery } from '../../enterprise/entities/customer-delivery'
import { CustomerDeliveriesRepository } from '../repositories/customer-deliveries-repository'

interface EditDeliveryUseCaseRequest {
  customerId: string
  deliveryId: string
  itemName: string
}

type EditDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    customerDelivery: CustomerDelivery
  }
>

export class EditDeliveryUseCase {
  constructor(
    private customerDeliveriesRepository: CustomerDeliveriesRepository,
  ) {}

  async execute(
    request: EditDeliveryUseCaseRequest,
  ): Promise<EditDeliveryUseCaseResponse> {
    const { customerId, deliveryId, itemName } = request

    const customerDelivery =
      await this.customerDeliveriesRepository.findById(deliveryId)

    if (!customerDelivery) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== customerDelivery.customerId.toString()) {
      return left(new NotAllowedError())
    }

    customerDelivery.itemName = itemName

    await this.customerDeliveriesRepository.save(customerDelivery)

    return right({
      customerDelivery,
    })
  }
}
