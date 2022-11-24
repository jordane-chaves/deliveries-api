import { User } from '../../entities/User';
import { ICreateUserDTO } from '../../use-cases/createUser/ICreateUserDTO';
import { IUsersRepository } from '../IUsersRepository';

export class InMemoryUsersRepository implements IUsersRepository {
  private repository: User[] = [];

  async create({
    name,
    username,
    password,
    type,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      name,
      username,
      password,
      type,
    });

    this.repository.push(user);

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.repository.find(user => user.username === username);
  }

  async findById(id: string): Promise<User> {
    return this.repository.find(user => user.id === id);
  }
}
