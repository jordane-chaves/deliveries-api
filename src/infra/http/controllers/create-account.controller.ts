import { z } from 'zod'

import { CustomerAlreadyExistsError } from '@/domain/account/application/use-cases/errors/customer-already-exists-error'
import { RegisterCustomerUseCase } from '@/domain/account/application/use-cases/register-customer'
import { Public } from '@/infra/auth/authentication/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerCustomer: RegisterCustomerUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerCustomer.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case CustomerAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
