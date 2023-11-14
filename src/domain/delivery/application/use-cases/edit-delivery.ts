import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface EditDeliveryUseCaseRequest {
  customerId: string
  deliveryId: string
  itemName: string
}

type EditDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class EditDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: EditDeliveryUseCaseRequest,
  ): Promise<EditDeliveryUseCaseResponse> {
    const { customerId, deliveryId, itemName } = request

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    if (customerId !== delivery.ownerId.toString()) {
      return left(new NotAllowedError())
    }

    delivery.itemName = itemName

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
