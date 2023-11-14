import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface CreateDeliveryUseCaseRequest {
  customerId: string
  itemName: string
}

type CreateDeliveryUseCaseResponse = Either<
  null,
  {
    delivery: Delivery
  }
>

@Injectable()
export class CreateDeliveryUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: CreateDeliveryUseCaseRequest,
  ): Promise<CreateDeliveryUseCaseResponse> {
    const { customerId, itemName } = request

    const delivery = Delivery.create({
      ownerId: new UniqueEntityID(customerId),
      itemName,
    })

    await this.deliveriesRepository.create(delivery)

    return right({
      delivery,
    })
  }
}
