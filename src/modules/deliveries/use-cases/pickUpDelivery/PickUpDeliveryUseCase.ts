import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

interface IPickUpDeliveryDTO {
  id_deliveryman: string;
  id_delivery: string;
}

@injectable()
export class PickUpDeliveryUseCase {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ id_delivery, id_deliveryman }: IPickUpDeliveryDTO) {
    const user = await this.usersRepository.findById(id_deliveryman);

    if (!user) {
      throw new AppError('User not found!');
    }

    if (user.type !== 'deliveryman') {
      throw new AppError('Deliveries can only be picked up by deliveryman!');
    }

    const delivery = await this.deliveriesRepository.findById(id_delivery);

    if (!delivery) {
      throw new AppError('Delivery not found!');
    }

    if (delivery.id_deliveryman) {
      throw new AppError('Delivery not available!');
    }

    return this.deliveriesRepository.addDeliveryman({
      id: delivery.id,
      id_deliveryman: user.id,
    });
  }
}
