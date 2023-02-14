import { IsEmail, IsNotEmpty } from 'class-validator'

export class UpdateUserDto {
    username: string

    @IsEmail(
        {},
        {
            message:
                'E-Posta adresi geçerli bir e-posta adresi formatında olmalıdır.',
        }
    )
    readonly email: string

    readonly bio?: string

    readonly image?: string
}
