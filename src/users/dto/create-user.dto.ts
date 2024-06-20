import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MaxLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'tajal islam', required: true })
  @MaxLength(50, {message: 'Username name length must be at most 50 characters'})
  @IsNotEmpty({message: 'Please enter username.'})
  @IsString({message: 'Username name must string.'})
  username: string;

  @ApiProperty({ example: 'tajal123#@!', required: true })
  @MaxLength(50, {message: 'Password name length must be at most 50 characters'})
  @IsNotEmpty({message: 'Please enter password.'})
  @IsString({message: 'Password name must string.'})
  password: string;

  @ApiProperty({ example: 'mdtajalislam1189@gmail.com' })
  @IsNotEmpty({ message: "Please enter a email address" })
  @IsEmail(
    { ignore_max_length: true },
    { message: "Should be valid email address", },
  )
  email: string;
}
