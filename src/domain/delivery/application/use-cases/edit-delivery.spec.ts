import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeCustomerDelivery } from '@/test/factories/make-customer-delivery'
import { InMemoryCustomerDeliveriesRepository } from '@/test/repositories/in-memory-customer-deliveries-repository'

import { EditDeliveryUseCase } from './edit-delivery'

let inMemoryCustomerDeliveriesRepository: InMemoryCustomerDeliveriesRepository

let sut: EditDeliveryUseCase

describe('Edit Delivery', () => {
  beforeEach(() => {
    inMemoryCustomerDeliveriesRepository =
      new InMemoryCustomerDeliveriesRepository()

    sut = new EditDeliveryUseCase(inMemoryCustomerDeliveriesRepository)
  })

  it('should be able to edit a customer delivery', async () => {
    const delivery = makeCustomerDelivery(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryCustomerDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
      itemName: 'New item',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      customerDelivery: expect.objectContaining({
        itemName: 'New item',
      }),
    })
  })

  it('should not be able to edit a delivery from another customer', async () => {
    const delivery = makeCustomerDelivery(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryCustomerDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      customerId: 'customer-2',
      deliveryId: 'delivery-1',
      itemName: 'New item',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
