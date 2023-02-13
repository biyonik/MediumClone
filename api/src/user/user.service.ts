import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { DtoHelperService } from './dto-helper.service';
import { RegisterResponse } from './models/register.response';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '@app/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dtoHelperService: DtoHelperService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<RegisterResponse> {
    const newUser =
      this.dtoHelperService.createUserDtoToUserEntity(createUserDto);
    const user = await this.userRepository.save(newUser);
    return this.buildUserResponse(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET_KEY
    );
  }

  buildUserResponse(user: UserEntity): RegisterResponse {
    return {
      email: user.email,
      username: user.username,
      bio: user.bio,
      image: user.image,
      token: this.generateJwt(user),
    } as unknown as RegisterResponse;
  }
}
