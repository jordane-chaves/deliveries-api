import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { PickUpDeliveryUseCase } from './PickUpDeliveryUseCase';

export class PickUpDeliveryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: id_deliveryman } = request.user;
    const { id: id_delivery } = request.params;

    const pickUpDeliveryUseCase = container.resolve(PickUpDeliveryUseCase);

    const delivery = await pickUpDeliveryUseCase.execute({
      id_delivery,
      id_deliveryman,
    });

    return response.json(delivery);
  }
}
