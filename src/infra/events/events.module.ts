import { OnDeliveryComplete } from '@/domain/notification/application/subscribers/on-delivery-complete'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [OnDeliveryComplete, SendNotificationUseCase],
})
export class EventsModule {}
