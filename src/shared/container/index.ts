import { container } from 'tsyringe';

import { PrismaUsersRepository } from '@modules/account/repositories/implementations/PrismaUsersRepository';
import { IUsersRepository } from '@modules/account/repositories/IUsersRepository';
import { IDeliveriesRepository } from '@modules/deliveries/repositories/IDeliveriesRepository';
import { PrismaDeliveriesRepository } from '@modules/deliveries/repositories/implementations/PrismaDeliveriesRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  PrismaUsersRepository,
);

container.registerSingleton<IDeliveriesRepository>(
  'DeliveriesRepository',
  PrismaDeliveriesRepository,
);
