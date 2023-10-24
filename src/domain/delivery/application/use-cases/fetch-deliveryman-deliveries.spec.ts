import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeDeliverymanDelivery } from '@/test/factories/make-deliveryman-delivery'
import { InMemoryDeliverymanDeliveriesRepository } from '@/test/repositories/in-memory-deliveryman-deliveries-repository'

import { FetchDeliverymanDeliveriesUseCase } from './fetch-deliveryman-deliveries'

let inMemoryDeliverymanDeliveriesRepository: InMemoryDeliverymanDeliveriesRepository

let sut: FetchDeliverymanDeliveriesUseCase

describe('Fetch Deliveryman Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliverymanDeliveriesRepository =
      new InMemoryDeliverymanDeliveriesRepository()

    sut = new FetchDeliverymanDeliveriesUseCase(
      inMemoryDeliverymanDeliveriesRepository,
    )
  })

  it('should be able to fetch deliveryman deliveries', async () => {
    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
      makeDeliverymanDelivery({
        deliverymanId: new UniqueEntityID('deliveryman-1'),
      }),
      makeDeliverymanDelivery({
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
      inMemoryDeliverymanDeliveriesRepository.items.push(
        makeDeliverymanDelivery({
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
