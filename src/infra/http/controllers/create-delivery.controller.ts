import { z } from 'zod'

import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/create-delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createDeliveryBodySchema = z.object({
  itemName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createDeliveryBodySchema)

type CreateDeliveryBodySchema = z.infer<typeof createDeliveryBodySchema>

@Controller('/deliveries')
@UseGuards(JwtAuthGuard)
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDeliveryBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { itemName } = body

    const result = await this.createDelivery.execute({
      itemName,
      customerId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
