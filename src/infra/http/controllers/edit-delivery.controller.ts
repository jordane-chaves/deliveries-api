import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/edit-delivery'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliveryBodySchema = z.object({
  itemName: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliveryBodySchema)

type EditDeliveryBodySchema = z.infer<typeof editDeliveryBodySchema>

@Controller('/deliveries/:id')
export class EditDeliveryController {
  constructor(private editDelivery: EditDeliveryUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') deliveryId: string,
  ) {
    const { itemName } = body
    const userId = user.sub

    const result = await this.editDelivery.execute({
      customerId: userId,
      deliveryId,
      itemName,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
