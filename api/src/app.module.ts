import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TagModule } from './tag/tag.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import ormConfig from '@app/orm.config'
import { UserModule } from './user/user.module'
import { AuthMiddleware } from './user/middlewares/auth.middleware'

@Module({
    imports: [TagModule, UserModule, TypeOrmModule.forRoot(ormConfig)],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(
                {
                    path: 'users',
                    method: RequestMethod.POST,
                },
                {
                    path: 'users/login',
                    method: RequestMethod.POST,
                }
            )
            .forRoutes({
                path: '*',
                method: RequestMethod.ALL,
            })
    }
}
