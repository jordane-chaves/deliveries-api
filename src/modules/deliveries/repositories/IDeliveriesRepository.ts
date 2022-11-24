import { Delivery } from '../entities/Delivery';
import { ICreateDeliveryDTO } from '../use-cases/createDelivery/ICreateDeliveryDTO';

export interface IAddDeliveryman {
  id: string;
  id_deliveryman: string;
}

export interface IDeliveriesRepository {
  create(data: ICreateDeliveryDTO): Promise<Delivery>;
  findById(id: string): Promise<Delivery>;
  findByUserId(id_user: string): Promise<Delivery[]>;
  findAvailable(): Promise<Delivery[]>;
  findByIdAndDeliverymanId(
    id: string,
    id_deliveryman: string,
  ): Promise<Delivery>;
  addDeliveryman(data: IAddDeliveryman): Promise<Delivery>;
}
