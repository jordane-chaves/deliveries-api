import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { InMemoryCustomersRepository } from '@/test/repositories/in-memory-customers-repository'

import { RegisterCustomerUseCase } from './register-customer'

let inMemoryCustomersRepository: InMemoryCustomersRepository
let fakeHasher: FakeHasher

let sut: RegisterCustomerUseCase

describe('Register Customer', () => {
  beforeEach(() => {
    inMemoryCustomersRepository = new InMemoryCustomersRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterCustomerUseCase(inMemoryCustomersRepository, fakeHasher)
  })

  it('should be able to register a new customer', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      customer: inMemoryCustomersRepository.items[0],
    })
  })

  it('should hash customer password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryCustomersRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
