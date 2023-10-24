import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryInProgressError extends Error implements UseCaseError {
  constructor() {
    super('Delivery is already underway.')
  }
}
