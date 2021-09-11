import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome não pode estar vazio!' })
  name: string;

  @IsEmail({}, { message: 'Email inválido ' })
  email: string;

  @IsNotEmpty({ message: 'O telefone não pode estar vazio!' })
  cellPhone: string;

  @IsNotEmpty({ message: 'A senha não pode estar vazia!' })
  password: string;
}
