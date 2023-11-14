import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'

export class InMemoryDeliverymenRepository implements DeliverymenRepository {
  public items: Deliveryman[] = []

  async findByEmail(email: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.email === email)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman)
  }
}
