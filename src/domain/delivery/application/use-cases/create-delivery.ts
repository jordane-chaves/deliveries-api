import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

import { CustomerDelivery } from '../../enterprise/entities/customer-delivery'
import { CustomerDeliveriesRepository } from '../repositories/customer-deliveries-repository'

interface CreateDeliveryUseCaseRequest {
  customerId: string
  itemName: string
}

type CreateDeliveryUseCaseResponse = Either<
  null,
  {
    customerDelivery: CustomerDelivery
  }
>

@Injectable()
export class CreateDeliveryUseCase {
  constructor(
    private customerDeliveriesRepository: CustomerDeliveriesRepository,
  ) {}

  async execute(
    request: CreateDeliveryUseCaseRequest,
  ): Promise<CreateDeliveryUseCaseResponse> {
    const { customerId, itemName } = request

    const customerDelivery = CustomerDelivery.create({
      customerId: new UniqueEntityID(customerId),
      itemName,
    })

    await this.customerDeliveriesRepository.create(customerDelivery)

    return right({
      customerDelivery,
    })
  }
}
