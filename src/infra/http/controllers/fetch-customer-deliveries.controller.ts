import { z } from 'zod'

import { FetchDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-deliveries'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
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

@Controller('/deliveries')
export class FetchCustomerDeliveriesController {
  constructor(private fetchDeliveries: FetchDeliveriesUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const userId = user.sub

    const result = await this.fetchDeliveries.execute({
      customerId: userId,
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
