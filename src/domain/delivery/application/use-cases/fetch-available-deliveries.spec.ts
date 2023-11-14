import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'

import { FetchAvailableDeliveriesUseCase } from './fetch-available-deliveries'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository

let sut: FetchAvailableDeliveriesUseCase

describe('Fetch Available Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()

    sut = new FetchAvailableDeliveriesUseCase(inMemoryDeliveriesRepository)
  })

  it('should be able to list available deliveries', async () => {
    inMemoryDeliveriesRepository.items.push(
      makeDelivery({ deliverymanId: null }),
      makeDelivery({ deliverymanId: null }),
      makeDelivery({ deliverymanId: null }),
    )

    const result = await sut.execute({
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
    for (let i = 1; i <= 22; i++) {
      inMemoryDeliveriesRepository.items.push(
        makeDelivery({ deliverymanId: null }),
      )
    }

    const result = await sut.execute({
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
})
