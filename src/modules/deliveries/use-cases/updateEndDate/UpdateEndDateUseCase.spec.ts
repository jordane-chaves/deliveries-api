import { InMemoryUsersRepository } from '@modules/account/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryDeliveriesRepository } from '@modules/deliveries/repositories/in-memory/InMemoryDeliveriesRepository';
import { AppError } from '@shared/errors/AppError';

import { UpdateEndDateUseCase } from './UpdateEndDateUseCase';

let sut: UpdateEndDateUseCase;
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('Update End Date', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new UpdateEndDateUseCase(
      inMemoryDeliveriesRepository,
      inMemoryUsersRepository,
    );
  });

  it('should be able to complete a delivery', async () => {
    const { id: id_deliveryman } = await inMemoryUsersRepository.create({
      name: 'Deliveryman Update End Date Test',
      username: 'deliveryman-update-end-date-test',
      password: 'any-password',
      type: 'deliveryman',
    });

    const delivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery to be Completed',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    delivery.id_deliveryman = id_deliveryman;

    const updatedDelivery = await sut.execute({
      id_delivery: delivery.id,
      id_deliveryman,
    });

    expect(updatedDelivery.id).toEqual(delivery.id);
    expect(updatedDelivery.end_at).toBeTruthy();
  });

  it('should not be able to complete a non-existent delivery', async () => {
    const { id: id_deliveryman } = await inMemoryUsersRepository.create({
      name: 'Any Deliveryman Name',
      username: 'any-deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    });

    await expect(
      sut.execute({
        id_delivery: 'non-existent-delivery',
        id_deliveryman,
      }),
    ).rejects.toEqual(new AppError('Delivery not found!'));
  });

  it('should not be able a non-existent deliveryman complete a delivery', async () => {
    const { id: id_delivery } = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery Test',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    await expect(
      sut.execute({ id_delivery, id_deliveryman: 'non-existent-deliveryman' }),
    ).rejects.toEqual(new AppError('Deliveryman not found!'));
  });

  it('should not be able a customer to complete a delivery', async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Customer Update End Date',
      username: 'customer-update-end-date',
      password: 'any-password',
      type: 'customer',
    });

    const { id: id_delivery } = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery to be Completed',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    await expect(
      sut.execute({ id_delivery, id_deliveryman: customer.id }),
    ).rejects.toEqual(
      new AppError('Only deliveryman can complete a delivery!'),
    );
  });

  it('should not be able complete a delivery of another deliveryman', async () => {
    const { id: id_deliveryman } = await inMemoryUsersRepository.create({
      name: 'Deliveryman Update End Date Test',
      username: 'deliveryman-update-end-date-test',
      password: 'any-password',
      type: 'deliveryman',
    });

    const delivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery to be Completed',
      location: 'Any Location Test',
      id_customer: 'any-customer-id',
    });

    delivery.id_deliveryman = id_deliveryman;

    const anotherDeliveryman = await inMemoryUsersRepository.create({
      name: 'Another Deliveryman Test',
      username: 'another-deliveryman-test',
      password: 'any-password',
      type: 'deliveryman',
    });

    await expect(
      sut.execute({
        id_delivery: delivery.id,
        id_deliveryman: anotherDeliveryman.id,
      }),
    ).rejects.toEqual(new AppError('Delivery not found!'));
  });
});
