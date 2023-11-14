import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      email: deliveryman.email,
      password: deliveryman.password,
      role: 'DELIVERYMAN',
    }
  }
}
