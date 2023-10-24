import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliveryUnavailableError extends Error implements UseCaseError {
  constructor() {
    super('Delivery unavailable.')
  }
}
