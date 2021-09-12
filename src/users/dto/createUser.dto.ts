import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio!' })
  name: string;

  @IsEmail({}, { message: 'Email inválido ' })
  email: string;

  @IsPhoneNumber('BR', {
    message: 'Número de telefone inválido',
  })
  cellPhone: string;

  password?: string;
}
