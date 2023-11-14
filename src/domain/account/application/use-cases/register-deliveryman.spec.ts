import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryDeliverymenRepository } from '@/test/repositories/in-memory-deliverymen-repository'

import { RegisterDeliverymanUseCase } from './register-deliveryman'

let inMemoryDeliverymenRepository: InMemoryDeliverymenRepository
let fakeHasher: FakeHasher

let sut: RegisterDeliverymanUseCase

describe('Register Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymenRepository = new InMemoryDeliverymenRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterDeliverymanUseCase(
      inMemoryDeliverymenRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymenRepository.items[0],
    })
  })

  it('should hash deliveryman password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymenRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
