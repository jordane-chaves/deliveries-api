import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/account/enterprise/entities/customer'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaUser): Customer {
    return Customer.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(customer: Customer): Prisma.UserUncheckedCreateInput {
    return {
      id: customer.id.toString(),
      name: customer.name,
      email: customer.email,
      password: customer.password,
    }
  }
}
