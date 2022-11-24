import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

enum UserTypes {
  CUSTOMER = 'customer',
  DELIVERYMAN = 'deliveryman',
}

interface IRequest {
  name: string;
  username: string;
  password: string;
}

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, password, username } = request.body as IRequest;

    const splittedPath = request.originalUrl.split('/');
    const type = splittedPath[splittedPath.length - 1] as UserTypes;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({
      name,
      password,
      type,
      username,
    });

    return response.status(201).json(user);
  }
}
