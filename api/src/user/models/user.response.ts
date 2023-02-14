import { UserEntity } from './../user.entity';

type UserResponseType = Omit<UserEntity, 'password'>;

export interface UserResponse extends UserResponseType {
}
