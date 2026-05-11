export interface PokeResponse {
  count: number;
  next: string;
  previous: null;
  results: PokemonDb[];
}

export interface PokemonDb {
  name: string;
  url: string;
}
