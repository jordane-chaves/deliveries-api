import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateEndDateUseCase } from './UpdateEndDateUseCase';

export class UpdateEndDateController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: id_deliveryman } = request.user;
    const { id: id_delivery } = request.params;

    const updateEndDateUseCase = container.resolve(UpdateEndDateUseCase);

    const delivery = await updateEndDateUseCase.execute({
      id_delivery,
      id_deliveryman,
    });

    return response.json(delivery);
  }
}
