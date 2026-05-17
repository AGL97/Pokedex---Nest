import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Error, isValidObjectId, Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      return await this.pokemonModel.create(createPokemonDto);
    } catch (error) {
      this.handleExceptions(error as Error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon | null = null;

    if ((await this.pokemonModel.countDocuments()) === 0) {
      throw new NotFoundException(`No Pokemons found in the database`);
    }

    //Number (no) search
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: +term });
    }

    //MongoID search
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with term ${term} not found`);
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonDB = await this.findOne(term);

    try {
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name
          .toLocaleLowerCase()
          .trim();
      }

      await pokemonDB.updateOne(updatePokemonDto, {
        returnDocument: 'after',
      });

      const updatedPokemon = {
        ...pokemonDB.toJSON(),
        ...updatePokemonDto,
      } as Pokemon;

      return updatedPokemon;

      //La deficiencia de esto es que se hacen 2 busquedas a la base de datos
      // const updatedPokemon = await this.pokemonModel.findByIdAndUpdate(
      //   pokemonDB._id,
      //   {
      //     name: updatePokemonDto.name,
      //     no: updatePokemonDto.no,
      //   },
      //   {
      //     returnDocument: 'after',
      //   },
      // );
      // return updatedPokemon;
    } catch (error) {
      this.handleExceptions(error as Error);
    }
  }

  async remove(id: string) {
    // const pokemonDB = await this.findOne(term);
    // await pokemonDB.deleteOne();
    const { acknowledged, deletedCount } = await this.pokemonModel.deleteOne({
      _id: id,
    });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return { result: acknowledged };
  }

  private handleExceptions(error: any): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (error.code === 11000) {
      throw new ConflictException(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to create Pokemon ${JSON.stringify(error.keyValue)} already exists `,
      );
    }

    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs for more details`,
    );
  }
}
