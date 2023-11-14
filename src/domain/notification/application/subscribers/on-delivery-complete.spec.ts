import { SpyInstance } from 'vitest'

import { makeDelivery } from '@/test/factories/make-delivery'
import { InMemoryDeliveriesRepository } from '@/test/repositories/in-memory-deliveries-repository'
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository'
import { waitFor } from '@/test/utils/wait-for'

import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { OnDeliveryComplete } from './on-delivery-complete'

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Delivery Complete', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotification = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnDeliveryComplete(inMemoryDeliveriesRepository, sendNotification)
  })

  it('should send notification when a delivery is completed', async () => {
    const delivery = makeDelivery()
    inMemoryDeliveriesRepository.items.push(delivery)

    delivery.complete()
    inMemoryDeliveriesRepository.save(delivery)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})
