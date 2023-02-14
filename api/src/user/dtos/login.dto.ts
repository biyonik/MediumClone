import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'E-Posta adresi boş bırakılamaz' })
  @IsEmail(
    {},
    {
      message: 'E-Posta adresi geçerli bir e-posta adresi formatında olmalıdır',
    },
  )
  readonly email: string;

  @IsNotEmpty({ message: 'Parola boş bırakılamaz!' })
  readonly password: string;
}
