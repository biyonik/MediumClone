import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dtos/create-user.dto'
import { UserEntity } from './user.entity'
import { UpdateUserDto } from '@app/user/dtos/update-user.dto'

@Injectable()
export class DtoHelperService {
    createUserDtoToUserEntity(createUserDto: CreateUserDto): UserEntity {
        return Object.assign(new UserEntity(), createUserDto)
    }

    updateUserDtoToUserEntity(updateUserDto: UpdateUserDto): UserEntity {
        return Object.assign(new UserEntity(), updateUserDto)
    }
}
