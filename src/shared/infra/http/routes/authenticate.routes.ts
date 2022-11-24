import { Router } from 'express';

import { AuthenticateUserController } from '@modules/account/use-cases/authenticateUser/AuthenticateUserController';

export const authenticateRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

authenticateRoutes.post('/sessions', authenticateUserController.handle);
