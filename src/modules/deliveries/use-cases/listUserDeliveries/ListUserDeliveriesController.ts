import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListUserDeliveriesUseCase } from './ListUserDeliveriesUseCase';

export class ListUserDeliveriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listUserDeliveriesUseCase = container.resolve(
      ListUserDeliveriesUseCase,
    );

    const deliveries = await listUserDeliveriesUseCase.execute(id);

    return response.json(deliveries);
  }
}
