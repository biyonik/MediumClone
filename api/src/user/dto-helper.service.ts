import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class DtoHelperService {
  createUserDtoToUserEntity(createUserDto: CreateUserDto): UserEntity {
    return Object.assign(new UserEntity(), createUserDto);
  }
}
