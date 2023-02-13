import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserEntity } from './user.entity';
import { RegisterResponse } from './models/register.response';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegisterResponse> {
    return await this.userService.createUser(createUserDto);
  }
}
