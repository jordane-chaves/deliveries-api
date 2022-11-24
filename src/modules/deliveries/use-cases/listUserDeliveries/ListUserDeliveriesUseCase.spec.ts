import { InMemoryUsersRepository } from '@modules/account/repositories/in-memory/InMemoryUsersRepository';
import { ICreateUserDTO } from '@modules/account/use-cases/createUser/ICreateUserDTO';
import { InMemoryDeliveriesRepository } from '@modules/deliveries/repositories/in-memory/InMemoryDeliveriesRepository';

import { ListUserDeliveriesUseCase } from './ListUserDeliveriesUseCase';

let sut: ListUserDeliveriesUseCase;

let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('List User Deliveries', () => {
  beforeEach(() => {
    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();

    sut = new ListUserDeliveriesUseCase(inMemoryDeliveriesRepository);
  });

  it('should be able to list all deliveries by customer id', async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Customer List Deliveries Test',
      username: 'customer-list-deliveries',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await inMemoryDeliveriesRepository.create({
      item_name: 'First Item Test',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    await inMemoryDeliveriesRepository.create({
      item_name: 'Second Item Test',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    const deliveries = await sut.execute(customer.id);

    expect(deliveries).toHaveLength(2);
  });

  it('should be able to list all deliveries by deliveryman id', async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Any Customer Name',
      username: 'any-customer-username',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await inMemoryDeliveriesRepository.create({
      item_name: 'Any Delivery',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    const delivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery with Deliveryman',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    const deliveryman = await inMemoryUsersRepository.create({
      name: 'Deliveryman Name',
      username: 'deliveryman-username',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    delivery.id_deliveryman = deliveryman.id;

    const deliveries = await sut.execute(deliveryman.id);

    expect(deliveries).toHaveLength(1);
  });

  it("should not be able to list another customer's deliveries", async () => {
    const ownerCustomer = await inMemoryUsersRepository.create({
      name: 'Any Customer Owner Deliveries',
      username: 'any-customer-owner-deliveries',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await inMemoryDeliveriesRepository.create({
      item_name: 'Any Item Test',
      location: 'Any Location Test',
      id_customer: ownerCustomer.id,
    });

    await inMemoryDeliveriesRepository.create({
      item_name: 'Another Item Test',
      location: 'Any Location Test',
      id_customer: ownerCustomer.id,
    });

    const anotherCustomer = await inMemoryUsersRepository.create({
      name: 'Another Customer',
      username: 'another-customer',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    const deliveries = await sut.execute(anotherCustomer.id);

    expect(deliveries).toHaveLength(0);
  });

  it("should not be able to list another deliveryman's deliveries", async () => {
    const customer = await inMemoryUsersRepository.create({
      name: 'Any Customer Name',
      username: 'any-customer-username',
      password: 'any-password',
      type: 'customer',
    } as ICreateUserDTO);

    await inMemoryDeliveriesRepository.create({
      item_name: 'Any Delivery',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    const delivery = await inMemoryDeliveriesRepository.create({
      item_name: 'Delivery with Deliveryman',
      location: 'Any Location Test',
      id_customer: customer.id,
    });

    const deliverymanOwner = await inMemoryUsersRepository.create({
      name: 'Owner Deliveryman Name',
      username: 'deliveryman-owner',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    delivery.id_deliveryman = deliverymanOwner.id;

    const anotherDeliveryman = await inMemoryUsersRepository.create({
      name: 'Another Deliveryman Name',
      username: 'another-deliveryman',
      password: 'any-password',
      type: 'deliveryman',
    } as ICreateUserDTO);

    const deliveries = await sut.execute(anotherDeliveryman.id);

    expect(deliveries).toHaveLength(0);
  });
});
