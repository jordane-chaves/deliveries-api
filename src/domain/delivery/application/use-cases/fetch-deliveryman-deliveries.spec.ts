import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { FetchDeliverymanDeliveriesUseCase } from './fetch-deliveryman-deliveries'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchDeliverymanDeliveriesUseCase

describe('Fetch Deliveryman Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new FetchDeliverymanDeliveriesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to fetch deliveryman deliveries', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
      makeDelivery({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
      makeDelivery({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
    )

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
        expect.objectContaining({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
      ],
    })
  })

  it('should be able to fetch paginated deliveryman deliveries', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        }),
      )
    }

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.deliveries).toHaveLength(2)
  })
})
