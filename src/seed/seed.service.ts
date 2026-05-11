import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { PokemonMapper } from 'src/common/mappers/pokemon.mapper';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly API_URL: string = 'https://pokeapi.co/api/v2/pokemon';
  private readonly api: AxiosInstance;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {
    this.api = axios.create({
      baseURL: this.API_URL,
    });
  }

  private async checkIfDbIsEmpty(): Promise<boolean> {
    const count = await this.pokemonModel.countDocuments();
    return count === 0;
  }

  async cleanDb() {
    try {
      await this.pokemonModel.deleteMany();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('No data was deleted.');
    }
  }

  async populateDB(limit: number = 10): Promise<{ message: string }> {
    let pokemons: PokeResponse;

    const isEmpty = await this.checkIfDbIsEmpty();

    if (!isEmpty) {
      return { message: 'Database is not empty. No data was added.' };
    }

    if (limit > 300) {
      throw new BadRequestException('Limit must be less than or equal to 300');
    }

    try {
      const { data } = await this.api.get<PokeResponse>(`?limit=${limit}`);
      pokemons = data;
    } catch (error) {
      console.error('Error fetching data from the API:', error);
      throw new InternalServerErrorException(
        'Error fetching data from the API',
      );
    }

    if (!pokemons || !pokemons.results) {
      console.error('Invalid data structure received from the API');
      throw new BadRequestException(
        'Invalid data structure received from the API',
      );
    }

    const mappedPokemons = pokemons.results.map((pokes) =>
      PokemonMapper.toEntity(pokes),
    );

    await this.pokemonModel.insertMany(mappedPokemons);

    // const insertPromisesArray: Promise<Pokemon>[] = [];
    // for (const pokemon of mappedPokemons) {
    //   insertPromisesArray.push(this.pokemonModel.create(pokemon));
    // }
    // await Promise.all(insertPromisesArray);

    //Forma menos eficiente
    // for (const pokemon of mappedPokemons) {
    //   await this.pokemonModel.create(pokemon);
    // }

    return { message: 'Database populated successfully.' };
  }
}
