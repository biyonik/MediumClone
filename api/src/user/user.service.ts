import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { DtoHelperService } from './dto-helper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dtoHelperService: DtoHelperService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser =
      this.dtoHelperService.createUserDtoToUserEntity(createUserDto);
    return await this.userRepository.save(newUser);
  }
}
