import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeDeliveryman } from '@/test/factories/make-deliveryman'
import { makeDeliverymanDelivery } from '@/test/factories/make-deliveryman-delivery'
import { InMemoryDeliverymanDeliveriesRepository } from '@/test/repositories/in-memory-deliveryman-deliveries-repository'
import { InMemoryDeliverymenRepository } from '@/test/repositories/in-memory-deliverymen-repository'

import { CompleteDeliveryUseCase } from './complete-delivery'

let inMemoryDeliverymanDeliveriesRepository: InMemoryDeliverymanDeliveriesRepository
let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository

let sut: CompleteDeliveryUseCase

describe('Complete Delivery', () => {
  beforeEach(() => {
    inMemoryDeliverymanDeliveriesRepository =
      new InMemoryDeliverymanDeliveriesRepository()
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()

    sut = new CompleteDeliveryUseCase(
      inMemoryDeliverymanDeliveriesRepository,
      inMemoryDeliverymenRepository,
    )
  })

  it('should be able to complete a delivery', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery(
        { deliverymanId: new UniqueEntityID('deliveryman-1') },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanDeliveriesRepository.items[0].endAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not complete a delivery if you are not a deliveryman', async () => {
    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery({}, new UniqueEntityID('delivery-1')),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to complete a delivery from another deliveryman', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery(
        { deliverymanId: new UniqueEntityID('deliveryman-1') },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to complete an available delivery', async () => {
    const deliveryman = makeDeliveryman({}, new UniqueEntityID('deliveryman-1'))
    inMemoryDeliverymenRepository.items.push(deliveryman)

    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery(
        { deliverymanId: null },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      deliverymanId: 'deliveryman-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
