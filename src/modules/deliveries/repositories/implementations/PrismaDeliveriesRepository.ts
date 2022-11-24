import { Delivery } from '@modules/deliveries/entities/Delivery';
import { ICreateDeliveryDTO } from '@modules/deliveries/use-cases/createDelivery/ICreateDeliveryDTO';
import { Prisma } from '@prisma/client';
import { prismaClient } from '@shared/infra/prisma/prismaClient';

import {
  IAddDeliveryman,
  IDeliveriesRepository,
} from '../IDeliveriesRepository';

export class PrismaDeliveriesRepository implements IDeliveriesRepository {
  private repository: Prisma.DeliveryDelegate<
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation
  >;

  constructor() {
    this.repository = prismaClient.delivery;
  }

  async create({
    item_name,
    location,
    id_customer,
    end_at,
    id,
  }: ICreateDeliveryDTO): Promise<Delivery> {
    const delivery = await this.repository.upsert({
      create: { item_name, location, id_customer },
      update: { item_name, location, end_at },
      where: { id: id ?? '' },
    });

    return delivery;
  }

  async findById(id: string): Promise<Delivery> {
    const delivery = await this.repository.findUnique({ where: { id } });

    return delivery;
  }

  async findByUserId(id: string): Promise<Delivery[]> {
    const deliveries = await this.repository.findMany({
      where: {
        OR: [
          { id_customer: { equals: id } },
          { id_deliveryman: { equals: id } },
        ],
      },
    });

    return deliveries;
  }

  async findByIdAndDeliverymanId(
    id: string,
    id_deliveryman: string,
  ): Promise<Delivery> {
    const delivery = await this.repository.findFirst({
      where: {
        AND: [
          { id: { equals: id } },
          { id_deliveryman: { equals: id_deliveryman } },
        ],
      },
    });

    return delivery;
  }

  async findAvailable(): Promise<Delivery[]> {
    const deliveries = await this.repository.findMany({
      where: {
        AND: {
          id_deliveryman: { equals: null },
          end_at: { equals: null },
        },
      },
    });

    return deliveries;
  }

  async addDeliveryman({
    id,
    id_deliveryman,
  }: IAddDeliveryman): Promise<Delivery> {
    const delivery = await this.repository.update({
      data: { id_deliveryman },
      where: { id },
    });

    return delivery;
  }
}
