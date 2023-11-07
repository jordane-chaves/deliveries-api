import { AuthenticateCustomerUseCase } from '@/domain/delivery/application/use-cases/authenticate-customer'
import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/create-delivery'
import { RegisterCustomerUseCase } from '@/domain/delivery/application/use-cases/register-customer'
import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateDeliveryController } from './controllers/create-delivery.controller'

@Module({
  imports: [AuthModule, CryptographyModule, DatabaseModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateDeliveryController,
  ],
  providers: [
    AuthenticateCustomerUseCase,
    CreateDeliveryUseCase,
    RegisterCustomerUseCase,
  ],
})
export class HttpModule {}
