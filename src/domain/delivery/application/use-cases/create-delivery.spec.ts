import { InMemoryCustomerDeliveriesRepository } from '@/test/repositories/in-memory-customer-deliveries-repository'

import { CreateDeliveryUseCase } from './create-delivery'

let inMemoryCustomerDeliveriesRepository: InMemoryCustomerDeliveriesRepository

let sut: CreateDeliveryUseCase

describe('Create Delivery', () => {
  beforeEach(() => {
    inMemoryCustomerDeliveriesRepository =
      new InMemoryCustomerDeliveriesRepository()

    sut = new CreateDeliveryUseCase(inMemoryCustomerDeliveriesRepository)
  })

  it('should be able to create a new delivery', async () => {
    const result = await sut.execute({
      customerId: 'customer-1',
      itemName: 'Example item',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomerDeliveriesRepository.items[0].itemName).toEqual(
      'Example item',
    )
  })
})
