import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymenRepository {
  findByEmail(email: string): Promise<Deliveryman | null>
  findById(id: string): Promise<Deliveryman | null>
  create(deliveryman: Deliveryman): Promise<void>
}
