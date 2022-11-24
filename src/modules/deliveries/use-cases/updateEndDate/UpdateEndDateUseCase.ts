import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

interface IUpdateEndDateData {
  id_delivery: string;
  id_deliveryman: string;
}

@injectable()
export class UpdateEndDateUseCase {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ id_delivery, id_deliveryman }: IUpdateEndDateData) {
    const deliveryman = await this.usersRepository.findById(id_deliveryman);

    if (!deliveryman) {
      throw new AppError('Deliveryman not found!');
    }

    if (deliveryman.type !== 'deliveryman') {
      throw new AppError('Only deliveryman can complete a delivery!');
    }

    const delivery = await this.deliveriesRepository.findByIdAndDeliverymanId(
      id_delivery,
      deliveryman.id,
    );

    if (!delivery) {
      throw new AppError('Delivery not found!');
    }

    delivery.end_at = new Date();

    return this.deliveriesRepository.create(delivery);
  }
}
