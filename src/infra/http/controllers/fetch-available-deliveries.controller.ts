import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { FetchAvailableDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-available-deliveries'
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UnauthorizedException,
} from '@nestjs/common'

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

@Controller('/deliveries/available')
export class FetchAvailableDeliveriesController {
  constructor(
    private fetchAvailableDeliveries: FetchAvailableDeliveriesUseCase,
  ) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchAvailableDeliveries.execute({
      page,
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

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(DeliveryPresenter.toHTTP),
    }
  }
}
