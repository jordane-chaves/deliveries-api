import { Either, left, right } from '@/core/either'

import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'
import { CustomersRepository } from '../repositories/customers-repository'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateCustomerUseCaseRequest {
  email: string
  password: string
}

type AuthenticateCustomerUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateCustomerUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute(
    request: AuthenticateCustomerUseCaseRequest,
  ): Promise<AuthenticateCustomerUseCaseResponse> {
    const { email, password } = request

    const customer = await this.customersRepository.findByEmail(email)

    if (!customer) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      customer.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: customer.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}
