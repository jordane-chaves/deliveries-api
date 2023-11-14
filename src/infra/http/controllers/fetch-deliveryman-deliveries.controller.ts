import { z } from 'zod'

import { FetchDeliverymanDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-deliveryman-deliveries'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryPresenter } from '../presenters/delivery-presenter'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliveries/deliveryman')
export class FetchDeliverymanDeliveriesController {
  constructor(
    private fetchDeliverymanDeliveries: FetchDeliverymanDeliveriesUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const deliverymanId = user.sub

    const result = await this.fetchDeliverymanDeliveries.execute({
      deliverymanId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(DeliveryPresenter.toHTTP),
    }
  }
}
