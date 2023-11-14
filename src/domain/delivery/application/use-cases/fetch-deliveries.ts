import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface FetchDeliveriesUseCaseRequest {
  customerId: string
  page: number
}

type FetchDeliveriesUseCaseResponse = Either<null, { deliveries: Delivery[] }>

@Injectable()
export class FetchDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: FetchDeliveriesUseCaseRequest,
  ): Promise<FetchDeliveriesUseCaseResponse> {
    const { customerId, page } = request

    const deliveries = await this.deliveriesRepository.findManyByCustomerId(
      customerId,
      {
        page,
      },
    )

    return right({
      deliveries,
    })
  }
}
