import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {
  @IsNumber()
  @IsUUID('4', { message: 'The ID must be a valid UUID v4' })
  @IsOptional()
  id: string;
}
