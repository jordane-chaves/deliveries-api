import { Router } from 'express';

import { CreateUserController } from '@modules/account/use-cases/createUser/CreateUserController';

export const usersRoutes = Router();

const createUserController = new CreateUserController();

usersRoutes.post('/customer', createUserController.handle);
usersRoutes.post('/deliveryman', createUserController.handle);
