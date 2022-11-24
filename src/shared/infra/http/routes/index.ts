import { Router } from 'express';

import { authenticateRoutes } from './authenticate.routes';
import { deliveriesRoutes } from './deliveries.routes';
import { usersRoutes } from './users.routes';

export const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/deliveries', deliveriesRoutes);
routes.use(authenticateRoutes);
