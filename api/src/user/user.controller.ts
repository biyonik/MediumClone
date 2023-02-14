import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { RegisterResponse } from './models/register.response'
import { LoginDto } from './dtos/login.dto'
import { LoginResponse } from './models/login.response'
import { UserResponse } from './models/user.response'
import { User } from '@app/user/decorators/user.decorator'
import { AuthGuard } from '@app/guards/auth.guard'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(
        @Body() createUserDto: CreateUserDto
    ): Promise<RegisterResponse> {
        return await this.userService.createUser(createUserDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        return await this.userService.login(loginDto)
    }

    @Get()
    @UseGuards(AuthGuard)
    async getCurrentUser(@User() user: UserResponse): Promise<UserResponse> {
        return user
    }
}
