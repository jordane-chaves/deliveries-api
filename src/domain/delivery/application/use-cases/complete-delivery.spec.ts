import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { CompleteDeliveryUseCase } from './complete-delivery'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: CompleteDeliveryUseCase

describe('Complete Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new CompleteDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to complete a delivery', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery(
        { deliverymanId: new UniqueEntityID('deliveryman-1') },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items[0].endAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to complete a delivery from another user', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery(
        { deliverymanId: new UniqueEntityID('deliveryman-1') },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
