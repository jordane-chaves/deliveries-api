import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeCustomerDelivery } from '@/test/factories/make-customer-delivery'
import { makeDeliverymanDelivery } from '@/test/factories/make-deliveryman-delivery'
import { InMemoryCustomerDeliveriesRepository } from '@/test/repositories/in-memory-customer-deliveries-repository'
import { InMemoryDeliverymanDeliveriesRepository } from '@/test/repositories/in-memory-deliveryman-deliveries-repository'

import { DeleteDeliveryUseCase } from './delete-delivery'
import { DeliveryInProgressError } from './errors/delivery-in-progress-error'

let inMemoryCustomerDeliveriesRepository: InMemoryCustomerDeliveriesRepository
let inMemoryDeliverymanDeliveriesRepository: InMemoryDeliverymanDeliveriesRepository

let sut: DeleteDeliveryUseCase

describe('Delete Delivery', () => {
  beforeEach(() => {
    inMemoryCustomerDeliveriesRepository =
      new InMemoryCustomerDeliveriesRepository()
    inMemoryDeliverymanDeliveriesRepository =
      new InMemoryDeliverymanDeliveriesRepository()

    sut = new DeleteDeliveryUseCase(
      inMemoryCustomerDeliveriesRepository,
      inMemoryDeliverymanDeliveriesRepository,
    )
  })

  it('should be able to delete a customer delivery', async () => {
    await inMemoryCustomerDeliveriesRepository.create(
      makeCustomerDelivery(
        {
          customerId: new UniqueEntityID('customer-1'),
        },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomerDeliveriesRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a delivery from another customer', async () => {
    await inMemoryCustomerDeliveriesRepository.create(
      makeCustomerDelivery(
        {
          customerId: new UniqueEntityID('customer-1'),
        },
        new UniqueEntityID('delivery-1'),
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-2',
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete unavailable delivery', async () => {
    const customerDelivery = makeCustomerDelivery(
      {
        customerId: new UniqueEntityID('customer-1'),
      },
      new UniqueEntityID('delivery-1'),
    )

    inMemoryCustomerDeliveriesRepository.items.push(customerDelivery)
    inMemoryDeliverymanDeliveriesRepository.items.push(
      makeDeliverymanDelivery(
        {
          deliverymanId: new UniqueEntityID('deliveryman-1'),
        },
        customerDelivery.id,
      ),
    )

    const result = await sut.execute({
      customerId: 'customer-1',
      deliveryId: 'delivery-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(DeliveryInProgressError)
  })
})
