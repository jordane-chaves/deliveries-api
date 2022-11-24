import { InMemoryUsersRepository } from '@modules/account/repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '@modules/account/use-cases/createUser/ICreateUserDTO';
import { InMemoryDeliveriesRepository } from '@modules/deliveries/repositories/in-memory/InMemoryDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateDeliveryUseCase } from './CreateDeliveryUseCase';

let sut: CreateDeliveryUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Create Delivery', () => {
  beforeAll(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new CreateDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to create a new Delivery', async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Customer Name',
      password: 'any-password',
      username: 'customer-username',
      type: 'customer',
    } as ICreateUserDTO);

    const delivery = await sut.execute({
      item_name: 'Any Delivery Item',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    expect(delivery).toHaveProperty('id');
    expect(delivery).toHaveProperty('created_at');
    expect(delivery.item_name).toEqual('Any Delivery Item');
  });

  it('should not be able to create a new Delivery for a non-existent customer', async () => {
    await expect(
      sut.execute({
        item_name: 'Any Delivery Name',
        location: 'Any Location Test',
        id_customer: 'non-existent-id',
      }),
    ).rejects.toEqual(new AppError('Customer not found!'));
  });

  it('should not be able a deliveryman create a new Delivery', async () => {
    const deliveryman = await inMemoryUsersRepository.create({
      name: 'Any Deliveryman Name',
      username: 'deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    await expect(
      sut.execute({
        item_name: 'Any Item Name',
        location: 'Any Location Test',
        id_customer: deliveryman.id,
      }),
    ).rejects.toEqual(new AppError('Only customers can create deliveries.'));
  });
});
