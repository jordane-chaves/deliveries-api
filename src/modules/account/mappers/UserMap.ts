import { User } from '../entities/User';

export class UserMap {
  static toDTO({ id, name, type, username }: User) {
    return { id, name, type, username };
  }
}
