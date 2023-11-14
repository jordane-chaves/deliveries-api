import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { DeleteDeliveryUseCase } from './delete-delivery'
import { DeliveryInProgressError } from './errors/delivery-in-progress-error'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: DeleteDeliveryUseCase

describe('Delete Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new DeleteDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to delete a delivery', async () => {
    await inMemoryDeliveriesRepository.create(
      makeDelivery(
        {
          ownerId: new UniqueEntityID('customer-1'),
        },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery from another user', async () => {
    await inMemoryDeliveriesRepository.create(
      makeDelivery(
        {
          ownerId: new UniqueEntityID('customer-1'),
        },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-2',
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete unavailable delivery', async () => {
    const delivery = makeDelivery(
      {
        ownerId: new UniqueEntityID('customer-1'),
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryInProgressError)
  })
})
