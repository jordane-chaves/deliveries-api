import { inject, injectable } from 'tsyringe';

import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ListAvailableDeliveriesUseCase {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute(user_id: string) {
    const user = await this.usersRepository.findById(user_id);

    if (user.type !== 'deliveryman') {
      throw new AppError('Only deliveryman can list available deliveries!');
    }

    return this.deliveriesRepository.findAvailable();
  }
}
