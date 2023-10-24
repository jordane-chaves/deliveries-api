import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeCustomerDelivery } from '@/test/factories/make-customer-delivery'
import { InMemoryCustomerDeliveriesRepository } from '@/test/repositories/in-memory-customer-deliveries-repository'

import { FetchCustomerDeliveriesUseCase } from './fetch-customer-deliveries'

let inMemoryCustomerDeliveriesRepository: InMemoryCustomerDeliveriesRepository

let sut: FetchCustomerDeliveriesUseCase

describe('Fetch Customer Deliveries', () => {
  beforeEach(() => {
    inMemoryCustomerDeliveriesRepository =
      new InMemoryCustomerDeliveriesRepository()

    sut = new FetchCustomerDeliveriesUseCase(
      inMemoryCustomerDeliveriesRepository,
    )
  })

  it('should be able to fetch customer deliveries', async () => {
    inMemoryCustomerDeliveriesRepository.items.push(
      makeCustomerDelivery({ customerId: new UniqueEntityID('customer-1') }),
      makeCustomerDelivery({ customerId: new UniqueEntityID('customer-1') }),
      makeCustomerDelivery({ customerId: new UniqueEntityID('customer-1') }),
    )

    const result = await sut.execute({ customerId: 'customer-1', page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          customerId: new UniqueEntityID('customer-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated customer deliveries', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCustomerDeliveriesRepository.create(
        makeCustomerDelivery({ customerId: new UniqueEntityID('customer-1') }),
      )
    }

    const result = await sut.execute({ customerId: 'customer-1', page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
