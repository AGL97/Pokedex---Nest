import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id/parse-mongo-id.pipe';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto) {
    const createdPokemon = await this.pokemonService.create(createPokemonDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'ok',
      data: createdPokemon,
    };
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    console.log('Query parameters:', query);
    const pokemons = await this.pokemonService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'ok',
      data: pokemons,
    };
  }

  @Get(':term')
  async findOne(@Param('term') term: string) {
    const pokemon = await this.pokemonService.findOne(term);
    return {
      statusCode: HttpStatus.OK,
      message: 'ok',
      data: pokemon,
    };
  }

  @Patch(':term')
  async update(
    @Param('term') term: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    const updatedPokemon = await this.pokemonService.update(
      term,
      updatePokemonDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'ok',
      data: updatedPokemon,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseMongoIdPipe) id: string) {
    const removedPokemon = await this.pokemonService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'ok',
      data: removedPokemon,
    };
  }
}
