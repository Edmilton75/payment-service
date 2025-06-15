import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID(4, { message: 'O merchantId deve ser um UUID válido.' })
  @IsNotEmpty({ message: 'O merchantId não pode estar vazio.' })
  merchantId: string;

  @IsNumber({}, { message: 'O valor (amount) deve ser um número.' })
  @IsPositive({ message: 'O valor (amount) dever ser positivo.' })
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;
}
