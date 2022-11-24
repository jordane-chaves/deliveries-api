import { Delivery } from '@modules/deliveries/entities/Delivery';
import { ICreateDeliveryDTO } from '@modules/deliveries/use-cases/createDelivery/ICreateDeliveryDTO';

import {
  IAddDeliveryman,
  IDeliveriesRepository,
} from '../IDeliveriesRepository';

export class InMemoryDeliveriesRepository implements IDeliveriesRepository {
  private repository: Delivery[] = [];

  async create({
    item_name,
    location,
    id_customer,
    id,
  }: ICreateDeliveryDTO): Promise<Delivery> {
    const deliveryExists = this.repository.find(delivery => delivery.id === id);

    if (deliveryExists) {
      return deliveryExists;
    }

    const delivery = new Delivery();

    Object.assign(delivery, { item_name, location, id_customer });

    this.repository.push(delivery);

    return delivery;
  }

  async findById(id: string): Promise<Delivery> {
    return this.repository.find(delivery => delivery.id === id);
  }

  async findByUserId(id_user: string): Promise<Delivery[]> {
    return this.repository.filter(
      delivery =>
        delivery.id_customer === id_user || delivery.id_deliveryman === id_user,
    );
  }

  async findAvailable(): Promise<Delivery[]> {
    return this.repository.filter(
      delivery => !delivery.id_deliveryman && !delivery.end_at,
    );
  }

  async findByIdAndDeliverymanId(
    id: string,
    id_deliveryman: string,
  ): Promise<Delivery> {
    return this.repository.find(
      delivery =>
        delivery.id === id && delivery.id_deliveryman === id_deliveryman,
    );
  }

  async addDeliveryman({
    id_deliveryman,
    id,
  }: IAddDeliveryman): Promise<Delivery> {
    const delivery = this.repository.find(delivery => delivery.id === id);

    delivery.id_deliveryman = id_deliveryman;

    return delivery;
  }
}
