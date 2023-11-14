import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { CompleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/complete-delivery'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRole } from '@/infra/auth/authorization/user-role'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'

@Controller('/deliveries/:id/complete')
@Roles(UserRole.DELIVERYMAN)
export class CompleteDeliveryController {
  constructor(private completeDelivery: CompleteDeliveryUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') deliveryId: string,
  ) {
    const deliverymanId = user.sub

    const result = await this.completeDelivery.execute({
      deliveryId,
      deliverymanId,
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
