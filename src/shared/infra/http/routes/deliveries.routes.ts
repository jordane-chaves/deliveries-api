import { Router } from 'express';

import { CreateDeliveryController } from '@modules/deliveries/use-cases/createDelivery/CreateDeliveryController';
import { ListAvailableDeliveriesController } from '@modules/deliveries/use-cases/listAvailableDeliveries/ListAvailableDeliveriesController';
import { ListUserDeliveriesController } from '@modules/deliveries/use-cases/listUserDeliveries/ListUserDeliveriesController';
import { PickUpDeliveryController } from '@modules/deliveries/use-cases/pickUpDelivery/PickUpDeliveryController';
import { UpdateEndDateController } from '@modules/deliveries/use-cases/updateEndDate/UpdateEndDateController';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

export const deliveriesRoutes = Router();

const createDeliveryController = new CreateDeliveryController();
const listUserDeliveriesController = new ListUserDeliveriesController();
const listAvailableDeliveriesController =
  new ListAvailableDeliveriesController();

const pickUpDeliveryController = new PickUpDeliveryController();
const updateEndDateController = new UpdateEndDateController();

deliveriesRoutes.post(
  '/',
  ensureAuthenticated,
  createDeliveryController.handle,
);

deliveriesRoutes.get(
  '/',
  ensureAuthenticated,
  listUserDeliveriesController.handle,
);

deliveriesRoutes.get(
  '/available',
  ensureAuthenticated,
  listAvailableDeliveriesController.handle,
);

deliveriesRoutes.patch(
  '/:id',
  ensureAuthenticated,
  pickUpDeliveryController.handle,
);

deliveriesRoutes.patch(
  '/:id/complete',
  ensureAuthenticated,
  updateEndDateController.handle,
);
