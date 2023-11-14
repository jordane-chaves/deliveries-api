import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { ChooseDeliveryUseCase } from './choose-delivery'
import { DeliveryUnavailableError } from './errors/delivery-unavailable-error'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: ChooseDeliveryUseCase

describe('Choose Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new ChooseDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to choose a delivery', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery({ deliverymanId: null }, new UniqueEntityID('delivery-1')),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
    )
  })

  it('should not be able to choose an unavailable delivery', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery(
        { deliverymanId: new UniqueEntityID('deliveryman-2') },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryUnavailableError)
  })
})
