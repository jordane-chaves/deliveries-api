import { z } from 'zod'

import { AuthenticateCustomerUseCase } from '@/domain/account/application/use-cases/authenticate-customer'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/authentication/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateCustomer: AuthenticateCustomerUseCase) {}

  @Post()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateCustomer.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
