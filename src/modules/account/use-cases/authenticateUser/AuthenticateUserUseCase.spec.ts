import { hash } from 'bcrypt';

import { AppError } from '@shared/errors/AppError';

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '../createUser/ICreateUserDTO';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let sut: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Authenticate User', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new AuthenticateUserUseCase(inMemoryUsersRepository);

    const passwordHash = await hash('any-password', 10);

    await inMemoryUsersRepository.create({
      name: 'Any User Authenticate Test',
      username: 'any-user-authenticate-test',
      password: passwordHash,
      type: 'deliveryman',
    } as ICreateUserDTO);
  });

  it('should be able to authenticate an user', async () => {
    const authUser = await sut.execute({
      username: 'any-user-authenticate-test',
      password: 'any-password',
    });

    expect(authUser).toHaveProperty('token');
  });

  it('should not be able to authenticate a non-existent user', async () => {
    await expect(
      sut.execute({
        username: 'non-existent-user',
        password: 'any-password-non-existent',
      }),
    ).rejects.toEqual(new AppError('Username or password incorrect!', 401));
  });

  it('should not be able to authenticate an user with invalid password', async () => {
    await expect(
      sut.execute({
        username: 'any-user-authenticate-test',
        password: 'invalid-password',
      }),
    ).rejects.toEqual(new AppError('Username or password incorrect!', 401));
  });
});
