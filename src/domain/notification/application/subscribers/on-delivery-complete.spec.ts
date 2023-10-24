import { SpyInstance } from 'vitest'

import { makeCustomerDelivery } from '@/test/factories/make-customer-delivery'
import { makeDeliverymanDelivery } from '@/test/factories/make-deliveryman-delivery'
import { InMemoryCustomerDeliveriesRepository } from '@/test/repositories/in-memory-customer-deliveries-repository'
import { InMemoryDeliverymanDeliveriesRepository } from '@/test/repositories/in-memory-deliveryman-deliveries-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { waitFor } from '@/test/utils/wait-for'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnDeliveryComplete } from './on-delivery-complete'

let inMemoryCustomerDeliveriesRepository: InMemoryCustomerDeliveriesRepository
let inMemoryDeliverymanDeliveriesRepository: InMemoryDeliverymanDeliveriesRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Delivery Complete', () => {
  beforeEach(() => {
    inMemoryCustomerDeliveriesRepository =
      new InMemoryCustomerDeliveriesRepository()
    inMemoryDeliverymanDeliveriesRepository =
      new InMemoryDeliverymanDeliveriesRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnDeliveryComplete(
      inMemoryCustomerDeliveriesRepository,
      sendNotification,
    )
  })

  it('should send notification when a delivery is completed', async () => {
    const customerDelivery = makeCustomerDelivery()
    const deliverymanDelivery = makeDeliverymanDelivery({}, customerDelivery.id)

    inMemoryCustomerDeliveriesRepository.items.push(customerDelivery)
    inMemoryDeliverymanDeliveriesRepository.items.push(deliverymanDelivery)

    deliverymanDelivery.complete()

    inMemoryDeliverymanDeliveriesRepository.save(deliverymanDelivery)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
