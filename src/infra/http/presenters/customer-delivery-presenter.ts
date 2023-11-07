import { CustomerDelivery } from '@/domain/delivery/enterprise/entities/customer-delivery'

export class CustomerDeliveryPresenter {
  static toHTTP(customerDelivery: CustomerDelivery) {
    return {
      id: customerDelivery.id.toString(),
      itemName: customerDelivery.itemName,
      endAt: customerDelivery.endAt,
      createdAt: customerDelivery.createdAt,
    }
  }
}
