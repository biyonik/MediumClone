import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserEntity } from './user.entity'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DtoHelperService } from './dto-helper.service'
import { AuthGuard } from '@app/guards/auth.guard'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    controllers: [UserController],
    providers: [UserService, DtoHelperService, AuthGuard],
    exports: [UserService],
})
export class UserModule {}
