import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

import { ICreateDeliveryDTO } from './ICreateDeliveryDTO';

@injectable()
export class CreateDeliveryUseCase {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ item_name, location, id_customer }: ICreateDeliveryDTO) {
    const customer = await this.usersRepository.findById(id_customer);

    if (!customer) {
      throw new AppError('Customer not found!');
    }

    if (customer.type !== 'customer') {
      throw new AppError('Only customers can create deliveries.');
    }

    return this.deliveriesRepository.create({
      item_name,
      location,
      id_customer,
    });
  }
}
