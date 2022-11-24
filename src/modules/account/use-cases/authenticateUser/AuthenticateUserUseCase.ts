import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '@config/auth';
import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';

interface IRequest {
  username: string;
  password: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ password, username }: IRequest) {
    const { secretToken, expiresIn } = auth;

    const user = await this.usersRepository.findByUsername(username);

    if (!user) {
      throw new AppError('Username or password incorrect!', 401);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Username or password incorrect!', 401);
    }

    const token = sign({ username }, secretToken, {
      subject: user.id,
      expiresIn,
    });

    return { token };
  }
}
