import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { DeliveryCompletedEvent } from '@/domain/delivery/enterprise/events/delivery-completed'
import { Injectable } from '@nestjs/common'

import { SendNotificationUseCase } from '../use-cases/send-notification'

@Injectable()
export class OnDeliveryComplete implements EventHandler {
  constructor(
    private deliveriesRepository: DeliveriesRepository,
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
    const customerDelivery = await this.deliveriesRepository.findById(
      delivery.id.toString(),
    )

    if (customerDelivery) {
      await this.sendNotification.execute({
        recipientId: customerDelivery.ownerId.toString(),
        title: 'Delivery completed.',
        content: `"${customerDelivery.itemName}" delivery has been completed.`,
      })
    }
  }
}
