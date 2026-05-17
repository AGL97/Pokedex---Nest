import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsString({ message: 'The name must be a string' })
  @IsNotEmpty({ message: 'The name must not be empty' })
  @MinLength(3, { message: 'The name must be at least 3 characters long' })
  name?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 },
    {
      message: 'The Pokemon number must be a valid number',
    },
  )
  @IsInt({ message: 'The Pokemon number must be an integer' })
  @IsPositive({ message: 'The Pokemon number must be a positive integer' })
  @Min(1, { message: 'The Pokemon number must be at least 0' })
  no?: number;
}
