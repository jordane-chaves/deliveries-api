import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeDeliveryman } from '@/test/factories/make-deliveryman'
import { makeDeliverymanDelivery } from '@/test/factories/make-deliveryman-delivery'
import { InMemoryDeliverymanDeliveriesRepository } from '@/test/repositories/in-memory-deliveryman-deliveries-repository'
import { InMemoryDeliverymenRepository } from '@/test/repositories/in-memory-deliverymen-repository'

import { FetchAvailableDeliveriesUseCase } from './fetch-available-deliveries'

let inMemoryDeliverymanDeliveriesRepository: InMemoryDeliverymanDeliveriesRepository
let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository

let sut: FetchAvailableDeliveriesUseCase

describe('Fetch Available Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliverymanDeliveriesRepository =
      new InMemoryDeliverymanDeliveriesRepository()
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()

    sut = new FetchAvailableDeliveriesUseCase(
      inMemoryDeliverymanDeliveriesRepository,
      inMemoryDeliverymenRepository,
    )
  })

  it('should be able to list available deliveries', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery({ deliverymanId: null }),
      makeDeliverymanDelivery({ deliverymanId: null }),
      makeDeliverymanDelivery({ deliverymanId: null }),
    )

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({ deliverymanId: null }),
        expect.objectContaining({ deliverymanId: null }),
        expect.objectContaining({ deliverymanId: null }),
      ],
    })
  })

  it('should be able to list paginated available deliveries', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    for (let i = 1; i <= 22; i++) {
      inMemoryDeliverymanDeliveriesRepository.items.push(
        makeDeliverymanDelivery({ deliverymanId: null }),
      )
    }

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveries: [
        expect.objectContaining({ deliverymanId: null }),
        expect.objectContaining({ deliverymanId: null }),
      ],
    })
  })

  it('should not be able to list available deliveries with a non-existent deliveryman', async () => {
    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery({ deliverymanId: null }),
      makeDeliverymanDelivery({ deliverymanId: null }),
      makeDeliverymanDelivery({ deliverymanId: null }),
    )

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
