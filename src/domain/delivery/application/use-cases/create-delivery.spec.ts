import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { CreateDeliveryUseCase } from './create-delivery'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: CreateDeliveryUseCase

describe('Create Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new CreateDeliveryUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to create a new delivery', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
      itemName: 'Example item',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliveriesRepository.items[0].itemName).toEqual(
      'Example item',
    )
  })
})
