import { inject, injectable } from 'tsyringe';

import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';

@injectable()
export class ListUserDeliveriesUseCase {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,
  ) {}

  async execute(user_id: string) {
    return this.deliveriesRepository.findByUserId(user_id);
  }
}
