import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymenRepository } from '../repositories/deliverymen-repository'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'

interface RegisterDeliverymanUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterDeliverymanUseCaseResponse = Either<
  DeliverymanAlreadyExistsError,
  { deliveryman: Deliveryman }
>

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymenRepository: DeliverymenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterDeliverymanUseCaseRequest,
  ): Promise<RegisterDeliverymanUseCaseResponse> {
    const { name, email, password } = request

    const deliverymanWithSameEmail =
      await this.deliverymenRepository.findByEmail(email)

    if (deliverymanWithSameEmail) {
      return left(new DeliverymanAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.deliverymenRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
