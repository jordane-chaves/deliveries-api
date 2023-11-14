import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { DeliveryUnavailableError } from './errors/delivery-unavailable-error'

interface ChooseDeliveryUseCaseRequest {
  deliverymanId: string
  deliveryId: string
}

type ChooseDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError | DeliveryUnavailableError,
  {
    delivery: Delivery
  }
>

@Injectable()
export class ChooseDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: ChooseDeliveryUseCaseRequest,
  ): Promise<ChooseDeliveryUseCaseResponse> {
    const { deliveryId, deliverymanId } = request

    const delivery = await this.deliveriesRepository.findById(deliveryId)

    if (!delivery) {
      return left(new ResourceNotFoundError())
    }

    const deliveryUnavailable = !!delivery.deliverymanId

    if (deliveryUnavailable) {
      return left(new DeliveryUnavailableError())
    }

    delivery.deliverymanId = new UniqueEntityID(deliverymanId)

    await this.deliveriesRepository.save(delivery)

    return right({
      delivery,
    })
  }
}
