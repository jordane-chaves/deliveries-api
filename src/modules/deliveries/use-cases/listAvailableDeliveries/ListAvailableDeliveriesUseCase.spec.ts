import { InMemoryUsersRepository } from '@modules/account/repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '@modules/account/use-cases/createUser/ICreateUserDTO';
import { InMemoryDeliveriesRepository } from '@modules/deliveries/repositories/in-memory/InMemoryDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

import { ListAvailableDeliveriesUseCase } from './ListAvailableDeliveriesUseCase';

let sut: ListAvailableDeliveriesUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('List Available Deliveries', () => {
  beforeEach(async () => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new ListAvailableDeliveriesUseCase(
      inMemoryDeliveriesRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to list available deliveries', async () => {
    await inMemoryDeliveriesRepository.create({
      item_name: 'First Item Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    await inMemoryDeliveriesRepository.create({
      item_name: 'Second Item Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    const deliveryman = await inMemoryUsersRepository.create({
      name: 'Deliveryman Name',
      username: 'deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    const availableDeliveries = await sut.execute(deliveryman.id);

    expect(availableDeliveries).toHaveLength(2);
  });

  it('should not be able the customer list available deliveries', async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Any Customer',
      username: 'any-customer',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await expect(sut.execute(customer.id)).rejects.toEqual(
      new AppError('Only deliveryman can list available deliveries!'),
    );
  });

  it('should not be able to list completed deliveries', async () => {
    await inMemoryDeliveriesRepository.create({
      item_name: 'First Item Completed Deliveries Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    const secondDelivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Second Item Completed Deliveries Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    secondDelivery.end_at = new Date();

    const deliveryman = await inMemoryUsersRepository.create({
      name: 'Deliveryman Completed Deliveries Test',
      username: 'deliveryman-completed-deliveries',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    const availableDeliveries = await sut.execute(deliveryman.id);

    expect(availableDeliveries).toHaveLength(1);
  });
});
