import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserEntity } from './user.entity'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dtos/create-user.dto'
import { DtoHelperService } from './dto-helper.service'
import { RegisterResponse } from './models/register.response'
import { sign } from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '@app/config'
import { LoginDto } from './dtos/login.dto'
import { LoginResponse } from './models/login.response'
import { compare } from 'bcrypt'
import { UpdateUserDto } from '@app/user/dtos/update-user.dto'
import { UserResponse } from '@app/user/models/user.response'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly dtoHelperService: DtoHelperService
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<RegisterResponse> {
        const emailIsExists = await this.emailIsExists(createUserDto.email)
        const usernameIsExists = await this.usernameIsExists(
            createUserDto.username
        )

        if (usernameIsExists || emailIsExists) {
            throw new HttpException(
                'E-Posta adresi veya kullanıcı adı zaten kullanılıyor!',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

        const newUser =
            this.dtoHelperService.createUserDtoToUserEntity(createUserDto)
        const user = await this.userRepository.save(newUser)
        return this.buildUserResponse(user)
    }

    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const emailIsExists = await this.emailIsExists(loginDto.email)
        if (emailIsExists === false) {
            throw new HttpException(
                'E-Posta adresine bağlı kullanıcı bulunamadı!',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            select: ['id', 'username', 'email', 'password'],
        })

        const isPasswordCorrect = await compare(
            loginDto.password,
            user.password
        )

        if (!isPasswordCorrect) {
            throw new HttpException(
                'Kimlik bilgileri uyuşmadı! Lütfen doğru bilgiler ile giriş yapmayı deneyiniz',
                HttpStatus.UNPROCESSABLE_ENTITY
            )
        }

        const token = await this.generateJwt(user)

        const loginResponse: LoginResponse = {
            id: user.id,
            access_token: token,
        }
        return loginResponse
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto
    ): Promise<UserResponse> {
        const user = await this.findById(id)
        Object.assign(user, updateUserDto)
        const result = await this.userRepository.update(id, user)
        if (result.affected === 1) return user
        throw new HttpException(
            'Güncelleme işlemi başarısız!',
            HttpStatus.UNPROCESSABLE_ENTITY
        )
    }

    generateJwt(user: UserEntity): string {
        return sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
            },
            JWT_SECRET_KEY
        )
    }

    buildUserResponse(user: UserEntity): RegisterResponse {
        return {
            email: user.email,
            username: user.username,
            bio: user.bio,
            image: user.image,
            token: this.generateJwt(user),
        } as unknown as RegisterResponse
    }

    async findById(id: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            where: { id },
        })
    }

    private async usernameIsExists(username: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { username },
        })
        return !!user
    }

    private async emailIsExists(email: string): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { email },
        })
        return !!user
    }
}
