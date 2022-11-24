import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableDeliveriesUseCase } from './ListAvailableDeliveriesUseCase';

export class ListAvailableDeliveriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listAvailableDeliveriesUseCase = container.resolve(
      ListAvailableDeliveriesUseCase,
    );

    const deliveries = await listAvailableDeliveriesUseCase.execute(id);

    return response.json(deliveries);
  }
}
