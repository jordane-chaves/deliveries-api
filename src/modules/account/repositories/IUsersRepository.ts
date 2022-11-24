import { User } from '../entities/User';
import { ICreateUserDTO } from '../use-cases/createUser/ICreateUserDTO';

export interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<User>;
}
