import { z } from 'zod'

import { DeliverymanAlreadyExistsError } from '@/domain/account/application/use-cases/errors/deliveryman-already-exists-error'
import { RegisterDeliverymanUseCase } from '@/domain/account/application/use-cases/register-deliveryman'
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

const createDeliverymanAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createDeliverymanAccountBodySchema,
)

type CreateDeliverymanAccountBodySchema = z.infer<
  typeof createDeliverymanAccountBodySchema
>

@Controller('/deliveryman')
@Public()
export class CreateDeliverymanAccountController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDeliverymanAccountBodySchema,
  ) {
    const { name, email, password } = body

    const result = await this.registerDeliveryman.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliverymanAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
