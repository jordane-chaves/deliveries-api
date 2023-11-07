import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Customer } from '../../enterprise/entities/customer'
import { HashGenerator } from '../cryptography/hash-generator'
import { CustomersRepository } from '../repositories/customers-repository'
import { CustomerAlreadyExistsError } from './errors/customer-already-exists-error'

interface RegisterCustomerUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterCustomerUseCaseResponse = Either<
  CustomerAlreadyExistsError,
  { customer: Customer }
>

@Injectable()
export class RegisterCustomerUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterCustomerUseCaseRequest,
  ): Promise<RegisterCustomerUseCaseResponse> {
    const { name, email, password } = request

    const customerWithSameEmail =
      await this.customersRepository.findByEmail(email)

    if (customerWithSameEmail) {
      return left(new CustomerAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const customer = Customer.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.customersRepository.create(customer)

    return right({
      customer,
    })
  }
}
