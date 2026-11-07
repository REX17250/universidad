export type NamedApiResource = {
  name: string;
  url: string;
};

export type NamedApiResourceList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
};

export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  abilities: Array<{
    is_hidden: boolean;
    slot: number;
    ability: NamedApiResource;
  }>;
  forms: NamedApiResource[];
  moves: Array<{
    move: NamedApiResource;
  }>;
  species: NamedApiResource;
  sprites: {
    front_default: string | null;
    other?: {
      "official-artwork"?: {
        front_default: string | null;
      };
    };
  };
  stats: Array<{
    base_stat: number;
    effort: number;
    stat: NamedApiResource;
  }>;
  types: Array<{
    slot: number;
    type: NamedApiResource;
  }>;
};

export type PokemonSpecies = {
  id: number;
  name: string;
  color: NamedApiResource;
  generation: NamedApiResource;
  habitat: NamedApiResource | null;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  shape: NamedApiResource;
  evolution_chain: { url: string };
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedApiResource;
    version: NamedApiResource;
  }>;
};

export type TypeResource = {
  id: number;
  name: string;
  damage_relations: Record<string, NamedApiResource[]>;
  pokemon: Array<{
    slot: number;
    pokemon: NamedApiResource;
  }>;
};

export type Ability = {
  id: number;
  name: string;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: NamedApiResource;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: NamedApiResource;
    version_group: NamedApiResource;
  }>;
  pokemon: Array<{
    is_hidden: boolean;
    slot: number;
    pokemon: NamedApiResource;
  }>;
};

export type Move = {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number | null;
  priority: number;
  power: number | null;
  damage_class: NamedApiResource;
  type: NamedApiResource;
  target: NamedApiResource;
  effect_entries: Array<{
    effect: string;
    short_effect: string;
    language: NamedApiResource;
  }>;
};

export type EvolutionChain = {
  id: number;
  chain: EvolutionNode;
};

export type EvolutionNode = {
  species: NamedApiResource;
  evolves_to: EvolutionNode[];
};
