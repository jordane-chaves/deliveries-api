import { Either, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'

interface FetchAvailableDeliveriesUseCaseRequest {
  page: number
}

type FetchAvailableDeliveriesUseCaseResponse = Either<
  NotAllowedError,
  { deliveries: Delivery[] }
>

@Injectable()
export class FetchAvailableDeliveriesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute(
    request: FetchAvailableDeliveriesUseCaseRequest,
  ): Promise<FetchAvailableDeliveriesUseCaseResponse> {
    const { page } = request

    const deliveries = await this.deliveriesRepository.findManyAvailable({
      page,
    })

    return right({
      deliveries,
    })
  }
}
