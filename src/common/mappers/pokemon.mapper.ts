import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonDb } from 'src/seed/interfaces/poke-response.interface';

export class PokemonMapper {
  static toEntity(pokemon: PokemonDb): CreatePokemonDto {
    const { name } = pokemon;
    const no: number = Number(
      pokemon.url.split('/').filter(Boolean).at(-1) || 0,
    );
    return {
      name,
      no,
    };
  }
}
