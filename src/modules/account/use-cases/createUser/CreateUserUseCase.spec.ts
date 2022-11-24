import { AppError } from '@shared/errors/AppError';

import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from './ICreateUserDTO';

let sut: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a new Customer', async () => {
    const userCustomer = await sut.execute({
      name: 'Any Customer Test',
      username: 'any-customer',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    expect(userCustomer).toHaveProperty('id');
    expect(userCustomer).toHaveProperty('type');
    expect(userCustomer.type).toEqual('customer');
  });

  it('should be able to create a new Deliveryman', async () => {
    const userDeliveryman = await sut.execute({
      name: 'Any Deliveryman Test',
      username: 'any-deliveryman',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    expect(userDeliveryman).toHaveProperty('id');
    expect(userDeliveryman).toHaveProperty('type');
    expect(userDeliveryman.type).toEqual('deliveryman');
  });

  it('should not be able to create an user with the same username', async () => {
    await sut.execute({
      name: 'Same Username',
      username: 'same-username-test',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await expect(
      sut.execute({
        name: 'Another User',
        username: 'same-username-test',
        password: 'any-password-to-test',
        type: 'customer',
      } as ICreateUserDTO),
    ).rejects.toEqual(new AppError('User already exists!'));
  });

  it('should not be able to create an user without name', async () => {
    await expect(
      sut.execute({
        username: 'any-username-without-name-test',
        password: 'any-password',
        type: 'customer',
      } as ICreateUserDTO),
    ).rejects.toEqual(new AppError('Name is required!'));
  });

  it('should not be able to create an user without username', async () => {
    await expect(
      sut.execute({
        name: 'Any User Without Username',
        password: 'any-password',
        type: 'customer',
      } as ICreateUserDTO),
    ).rejects.toEqual(new AppError('Username is required!'));
  });

  it('should not be able to create an user without type', async () => {
    await expect(
      sut.execute({
        name: 'Any User Without Type',
        username: 'any-username-without-type-test',
        password: 'any-password',
      } as ICreateUserDTO),
    ).rejects.toEqual(new AppError('Type is required!'));
  });

  it('should not be able to create an user without password', async () => {
    await expect(
      sut.execute({
        name: 'Any User Without Password',
        username: 'any-username-without-password-test',
        type: 'deliveryman',
      } as ICreateUserDTO),
    ).rejects.toEqual(new AppError('Password is required!'));
  });

  it('should not be returned the password', async () => {
    const user = await sut.execute({
      name: 'Deliveryman User Test',
      username: 'deliveryman-user-test',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    expect(user).not.toHaveProperty('password');
  });
});
