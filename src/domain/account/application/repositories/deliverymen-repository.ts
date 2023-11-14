import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymenRepository {
  abstract findByEmail(email: string): Promise<Deliveryman | null>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract create(deliveryman: Deliveryman): Promise<void>
}
