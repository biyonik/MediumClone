import { ExpressRequestInterface } from '@app/types/express-request.interface'
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common'
import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET_KEY } from '@app/config'
import { UserService } from './../user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) {}
    async use(req: ExpressRequestInterface, _: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            next()
        }
        
        if (!req.headers.authorization) {
            throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED)
        }
        
        const token = req.headers.authorization.split(' ')[1]

        try {
            const decode = verify(token, JWT_SECRET_KEY)
            const user = await this.userService.findById(decode.id)
            req.user = user
            next()
        } catch (error) {
            req.user = null
            next()
        }
    }
}
