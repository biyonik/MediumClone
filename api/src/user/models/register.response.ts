import { UserType } from './user.type';

export interface RegisterResponse {
  user: UserType & { token: string };
}
