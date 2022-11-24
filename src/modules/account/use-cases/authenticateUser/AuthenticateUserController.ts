import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

interface IRequest {
  username: string;
  password: string;
}

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, username } = request.body as IRequest;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    const userInfos = await authenticateUserUseCase.execute({
      password,
      username,
    });

    return response.json(userInfos);
  }
}
