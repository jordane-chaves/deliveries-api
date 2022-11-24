import { User } from '../../entities/User';

export type ICreateUserDTO = Pick<
  User,
  'name' | 'username' | 'password' | 'type'
>;
