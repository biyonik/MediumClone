import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Kullanıcı adı boş bırakılamaz!' })
  username: string;

  @IsNotEmpty({ message: 'E-Posta adresi boş bırakılamaz!' })
  @IsEmail(
    {},
    {
      message:
        'E-Posta adresi geçerli bir e-posta adresi formatında olmalıdır.',
    },
  )
  email: string;

  @IsNotEmpty({ message: 'Parola boş bırakılamaz!' })
  password: string;
}
