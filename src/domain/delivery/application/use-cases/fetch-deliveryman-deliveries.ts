import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface FetchDeliverymanDeliveriesUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchDeliverymanDeliveriesUseCaseResponse = Either<
  null,
  {
    deliveries: Delivery[]
  }
>

@Injectable()
export class FetchDeliverymanDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: FetchDeliverymanDeliveriesUseCaseRequest,
  ): Promise<FetchDeliverymanDeliveriesUseCaseResponse> {
    const { deliverymanId, page } = request

    const deliveries = await this.deliveriesRepository.findManyByDeliverymanId(
      deliverymanId,
      { page },
    )

    return right({
      deliveries,
    })
  }
}
