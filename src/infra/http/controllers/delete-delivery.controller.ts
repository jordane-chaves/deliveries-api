import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delete-delivery'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/deliveries/:id')
export class DeleteDeliveryController {
  constructor(private deleteCustomerDelivery: DeleteDeliveryUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') deliveryId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteCustomerDelivery.execute({
      customerId: userId,
      deliveryId,
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
