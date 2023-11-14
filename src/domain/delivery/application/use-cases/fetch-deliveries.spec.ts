import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { FetchDeliveriesUseCase } from './fetch-deliveries'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliveriesUseCase

describe('Fetch Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new FetchDeliveriesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch deliveries', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery({ ownerId: new UniqueEntityID('customer-1') }),
      makeDelivery({ ownerId: new UniqueEntityID('customer-1') }),
      makeDelivery({ ownerId: new UniqueEntityID('customer-1') }),
    )

    const result = await sut.execute({ customerId: 'customer-1', page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({
          ownerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          ownerId: new UniqueEntityID('customer-1'),
        }),
        expect.objectContaining({
          ownerId: new UniqueEntityID('customer-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated deliveries', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryDeliveriesRepository.create(
        makeDelivery({ ownerId: new UniqueEntityID('customer-1') }),
      )
    }

    const result = await sut.execute({ customerId: 'customer-1', page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
