import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';

import { UserMap } from '../../mappers/UserMap';
import { IUsersRepository } from '../../repositories/IUsersRepository';
import { ICreateUserDTO } from './ICreateUserDTO';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ name, password, username, type }: ICreateUserDTO) {
    if (!name) {
      throw new AppError('Name is required!');
    }

    if (!username) {
      throw new AppError('Username is required!');
    }

    if (!password) {
      throw new AppError('Password is required!');
    }

    if (!type) {
      throw new AppError('Type is required!');
    }

    const userAlreadyExists = await this.usersRepository.findByUsername(
      username,
    );

    if (userAlreadyExists) {
      throw new AppError('User already exists!');
    }

    const passwordHash = await hash(password, 10);

    const user = await this.usersRepository.create({
      name,
      username,
      password: passwordHash,
      type,
    });

    return UserMap.toDTO(user);
  }
}
