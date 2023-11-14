import { AuthenticateCustomerUseCase } from '@/domain/account/application/use-cases/authenticate-customer'
import { AuthenticateDeliverymanUseCase } from '@/domain/account/application/use-cases/authenticate-deliveryman'
import { RegisterCustomerUseCase } from '@/domain/account/application/use-cases/register-customer'
import { RegisterDeliverymanUseCase } from '@/domain/account/application/use-cases/register-deliveryman'
import { ChooseDeliveryUseCase } from '@/domain/delivery/application/use-cases/choose-delivery'
import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/create-delivery'
import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delete-delivery'
import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/edit-delivery'
import { FetchAvailableDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-available-deliveries'
import { FetchDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-deliveries'
import { FetchDeliverymanDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-deliveryman-deliveries'
import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateDeliverymanController } from './controllers/authenticate-deliveryman.controller'
import { AuthenticateController } from './controllers/authenticate.controller'
import { ChooseDeliveryController } from './controllers/choose-delivery.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateDeliveryController } from './controllers/create-delivery.controller'
import { CreateDeliverymanAccountController } from './controllers/create-deliveryman-account.controller'
import { DeleteDeliveryController } from './controllers/delete-delivery.controller'
import { EditDeliveryController } from './controllers/edit-delivery.controller'
import { FetchAvailableDeliveriesController } from './controllers/fetch-available-deliveries.controller'
import { FetchCustomerDeliveriesController } from './controllers/fetch-customer-deliveries.controller'
import { FetchDeliverymanDeliveriesController } from './controllers/fetch-deliveryman-deliveries.controller'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    AuthenticateDeliverymanController,
    ChooseDeliveryController,
    CreateAccountController,
    CreateDeliveryController,
    CreateDeliverymanAccountController,
    DeleteDeliveryController,
    EditDeliveryController,
    FetchAvailableDeliveriesController,
    FetchCustomerDeliveriesController,
    FetchDeliverymanDeliveriesController,
  ],
  providers: [
    AuthenticateCustomerUseCase,
    AuthenticateDeliverymanUseCase,
    ChooseDeliveryUseCase,
    CreateDeliveryUseCase,
    DeleteDeliveryUseCase,
    EditDeliveryUseCase,
    RegisterCustomerUseCase,
    RegisterDeliverymanUseCase,
    FetchAvailableDeliveriesUseCase,
    FetchDeliveriesUseCase,
    FetchDeliverymanDeliveriesUseCase,
  ],
})
export class HttpModule {}
