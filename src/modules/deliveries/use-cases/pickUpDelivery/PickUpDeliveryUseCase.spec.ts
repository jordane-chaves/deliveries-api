import { InMemoryUsersRepository } from '@modules/account/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryDeliveriesRepository } from '@modules/deliveries/repositories/in-memory/InMemoryDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

import { PickUpDeliveryUseCase } from './PickUpDeliveryUseCase';

let sut: PickUpDeliveryUseCase;

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Pick Up Delivery', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new PickUpDeliveryUseCase(
      inMemoryDeliveriesRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to pick up a delivery', async () => {
    const { id: id_delivery } = await inMemoryDeliveriesRepository.create({
      item_name: 'Any Item Pick Up Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    const { id: id_deliveryman } = await inMemoryUsersRepository.create({
      name: 'Deliveryman Name',
      username: 'deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    });

    const deliveryPick = await sut.execute({ id_delivery, id_deliveryman });

    expect(deliveryPick.id_deliveryman).toEqual(id_deliveryman);
  });

  it('should not be able a non-existent deliveryman pick up a delivery', async () => {
    const { id: id_delivery } = await inMemoryDeliveriesRepository.create({
      item_name: 'Any Item',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    await expect(
      sut.execute({
        id_delivery,
        id_deliveryman: 'non-existent-deliveryman',
      }),
    ).rejects.toEqual(new AppError('User not found!'));
  });

  it('should not be able the customer to pick up a delivery', async () => {
    const { id: id_delivery } = await inMemoryDeliveriesRepository.create({
      item_name: 'Any Item Pick Up Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    const customer = await inMemoryUsersRepository.create({
      name: 'Customer Name',
      username: 'customer-username',
      password: 'any-password',
      type: 'customer',
    });

    await expect(
      sut.execute({
        id_delivery,
        id_deliveryman: customer.id,
      }),
    ).rejects.toEqual(
      new AppError('Deliveries can only be picked up by deliveryman!'),
    );
  });

  it('should not be able to pick up a non-existent delivery', async () => {
    const { id: id_deliveryman } = await inMemoryUsersRepository.create({
      name: 'Any Deliveryman Name',
      username: 'any-deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    });

    await expect(
      sut.execute({ id_delivery: 'non-existent-delivery', id_deliveryman }),
    ).rejects.toEqual(new AppError('Delivery not found!'));
  });

  it('should not be able to pick up a delivery from another deliveryman', async () => {
    const delivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Any Item Not be able to find it',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    const firstDeliveryman = await inMemoryUsersRepository.create({
      name: 'First Deliveryman Name',
      username: 'first-deliveryman-username',
      password: 'first-password',
      type: 'deliveryman',
    });

    await sut.execute({
      id_delivery: delivery.id,
      id_deliveryman: firstDeliveryman.id,
    });

    const secondDeliveryman = await inMemoryUsersRepository.create({
      name: 'Second Deliveryman Name',
      username: 'second-deliveryman-username',
      password: 'second-password',
      type: 'deliveryman',
    });

    await expect(
      sut.execute({
        id_delivery: delivery.id,
        id_deliveryman: secondDeliveryman.id,
      }),
    ).rejects.toEqual(new AppError('Delivery not available!'));
  });
});
