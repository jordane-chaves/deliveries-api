import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateDeliveryUseCase } from './CreateDeliveryUseCase';

interface IRequest {
  item_name: string;
  location: string;
}

export class CreateDeliveryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { item_name, location } = request.body as IRequest;

    const createDeliveryUseCase = container.resolve(CreateDeliveryUseCase);

    const delivery = await createDeliveryUseCase.execute({
      item_name,
      location,
      id_customer: id,
    });

    return response.status(201).json(delivery);
  }
}
