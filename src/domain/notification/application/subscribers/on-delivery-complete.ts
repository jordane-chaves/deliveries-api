import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { CustomerDeliveriesRepository } from '@/domain/delivery/application/repositories/customer-deliveries-repository'
import { DeliveryCompletedEvent } from '@/domain/delivery/enterprise/events/delivery-completed'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnDeliveryComplete implements EventHandler {
  constructor(
    private customerDeliveriesRepository: CustomerDeliveriesRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryCompleteNotification.bind(this),
      DeliveryCompletedEvent.name,
    )
  }

  private async sendDeliveryCompleteNotification({
    delivery,
  }: DeliveryCompletedEvent) {
    const customerDelivery = await this.customerDeliveriesRepository.findById(
      delivery.id.toString(),
    )

    if (customerDelivery) {
      await this.sendNotification.execute({
        recipientId: customerDelivery.customerId.toString(),
        title: 'Delivery completed.',
        content: `"${customerDelivery.itemName}" delivery has been completed.`,
      })
    }
  }
}
