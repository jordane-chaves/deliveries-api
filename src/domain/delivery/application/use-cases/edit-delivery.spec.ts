import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { EditDeliveryUseCase } from './edit-delivery'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: EditDeliveryUseCase

describe('Edit Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new EditDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to edit a delivery', async () => {
    const delivery = makeDelivery(
      {
        ownerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
      itemName: 'New item',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      delivery: expect.objectContaining({
        itemName: 'New item',
      }),
    })
  })

  it('should not be able to edit a delivery from another user', async () => {
    const delivery = makeDelivery(
      {
        ownerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      customerId: 'customer-2',
      deliveryId: 'delivery-1',
      itemName: 'New item',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
