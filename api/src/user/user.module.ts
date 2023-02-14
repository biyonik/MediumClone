import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserEntity } from './user.entity'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DtoHelperService } from './dto-helper.service'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, DtoHelperService],
})
export class UserModule {}
