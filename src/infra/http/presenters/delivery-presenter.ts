import { Delivery } from '@/domain/delivery/enterprise/entities/delivery'

export class DeliveryPresenter {
  static toHTTP(delivery: Delivery) {
    return {
      id: delivery.id.toString(),
      ownerId: delivery.ownerId.toString(),
      deliverymanId: delivery.deliverymanId
        ? delivery.deliverymanId.toString()
        : null,
      itemName: delivery.itemName,
      endAt: delivery.endAt,
      createdAt: delivery.createdAt,
    }
  }
}
