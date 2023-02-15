import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    SetMetadata,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { ExpressRequestInterface } from '@app/types/express-request.interface'
import { Reflector } from '@nestjs/core'

export const NoAuth = () => SetMetadata('no-auth', true)

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        
    }
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {

        const noAuth = this.reflector.get<boolean>('no-auth', context.getHandler())
        if (noAuth) return true

        const request = context
            .switchToHttp()
            .getRequest<ExpressRequestInterface>()
        if (request.user) {
            return true
        }
        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED)
    }
}
