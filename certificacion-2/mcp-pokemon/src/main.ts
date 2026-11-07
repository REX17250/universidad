import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { z } from "zod/v4";
import { englishEntry, normalizeIdentifier, PokeApiClient, PokeApiError } from "./pokeapi/client.js";
import type {
  Ability,
  EvolutionChain,
  EvolutionNode,
  Move,
  NamedApiResourceList,
  Pokemon,
  PokemonSpecies,
  TypeResource,
} from "./pokeapi/types.js";

const api = new PokeApiClient();

function textResult(text: string, structuredContent?: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text }],
    structuredContent,
  };
}

function errorResult(error: unknown) {
  if (error instanceof PokeApiError) {
    return textResult(`PokeAPI error: ${error.message}${error.url ? ` (${error.url})` : ""}`);
  }
  return textResult(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
}

function pokemonSummary(pokemon: Pokemon, species?: PokemonSpecies) {
  const artwork = pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default;
  const flavor = englishEntry(species?.flavor_text_entries)?.flavor_text.replace(/\s+/g, " ");

  return {
    id: pokemon.id,
    name: pokemon.name,
    heightMeters: pokemon.height / 10,
    weightKg: pokemon.weight / 10,
    baseExperience: pokemon.base_experience,
    types: pokemon.types.sort((a, b) => a.slot - b.slot).map((item) => item.type.name),
    abilities: pokemon.abilities.map((item) => ({
      name: item.ability.name,
      hidden: item.is_hidden,
    })),
    stats: Object.fromEntries(pokemon.stats.map((item) => [item.stat.name, item.base_stat])),
    moveCount: pokemon.moves.length,
    species: species
      ? {
          color: species.color.name,
          generation: species.generation.name,
          habitat: species.habitat?.name ?? null,
          isBaby: species.is_baby,
          isLegendary: species.is_legendary,
          isMythical: species.is_mythical,
          flavor,
        }
      : undefined,
    artwork,
  };
}

function formatPokemon(summary: ReturnType<typeof pokemonSummary>) {
  const stats = Object.entries(summary.stats)
    .map(([name, value]) => `${name}: ${value}`)
    .join(", ");
  const abilities = summary.abilities
    .map((ability) => `${ability.name}${ability.hidden ? " (hidden)" : ""}`)
    .join(", ");

  return [
    `#${summary.id} ${summary.name}`,
    `Types: ${summary.types.join(", ")}`,
    `Height: ${summary.heightMeters} m | Weight: ${summary.weightKg} kg`,
    `Abilities: ${abilities}`,
    `Stats: ${stats}`,
    `Known moves: ${summary.moveCount}`,
    summary.species?.flavor ? `Flavor: ${summary.species.flavor}` : undefined,
    summary.artwork ? `Artwork: ${summary.artwork}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

function flattenEvolution(node: EvolutionNode, depth = 0): Array<{ name: string; depth: number }> {
  return [
    { name: node.species.name, depth },
    ...node.evolves_to.flatMap((child) => flattenEvolution(child, depth + 1)),
  ];
}

function createServer() {
  const server = new McpServer({
    name: "mcpPokemon",
    version: "1.0.0",
  });

  server.registerTool(
    "get-pokemon",
    {
      title: "Get Pokemon",
      description: "Get a concise Pokemon profile by name or numeric id.",
      inputSchema: z.object({
        pokemon: z.union([z.string(), z.number()]).describe("Pokemon name or id, e.g. pikachu or 25."),
        includeSpecies: z.boolean().default(true).describe("Include species metadata and flavor text."),
      }),
    },
    async ({ pokemon, includeSpecies }) => {
      try {
        const data = await api.get<Pokemon>(`/pokemon/${normalizeIdentifier(pokemon)}`);
        const species = includeSpecies ? await api.get<PokemonSpecies>(data.species.url) : undefined;
        const summary = pokemonSummary(data, species);
        return textResult(formatPokemon(summary), { pokemon: summary });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "compare-pokemon",
    {
      title: "Compare Pokemon",
      description: "Compare two Pokemon by types, abilities, dimensions, and base stats.",
      inputSchema: z.object({
        first: z.union([z.string(), z.number()]),
        second: z.union([z.string(), z.number()]),
      }),
    },
    async ({ first, second }) => {
      try {
        const [left, right] = await Promise.all([
          api.get<Pokemon>(`/pokemon/${normalizeIdentifier(first)}`),
          api.get<Pokemon>(`/pokemon/${normalizeIdentifier(second)}`),
        ]);
        const leftSummary = pokemonSummary(left);
        const rightSummary = pokemonSummary(right);
        const statNames = Array.from(new Set([...Object.keys(leftSummary.stats), ...Object.keys(rightSummary.stats)]));
        const statLines = statNames.map((stat) => {
          const a = Number(leftSummary.stats[stat] ?? 0);
          const b = Number(rightSummary.stats[stat] ?? 0);
          const winner = a === b ? "tie" : a > b ? leftSummary.name : rightSummary.name;
          return `${stat}: ${leftSummary.name} ${a} vs ${rightSummary.name} ${b} (${winner})`;
        });
        return textResult(
          [`${leftSummary.name} vs ${rightSummary.name}`, `Types: ${leftSummary.types.join("/")} vs ${rightSummary.types.join("/")}`, ...statLines].join("\n"),
          { first: leftSummary, second: rightSummary },
        );
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "list-pokemon",
    {
      title: "List Pokemon",
      description: "List Pokemon with PokeAPI pagination.",
      inputSchema: z.object({
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      }),
    },
    async ({ limit, offset }) => {
      try {
        const list = await api.list<NamedApiResourceList>("pokemon", limit, offset);
        const names = list.results.map((item) => item.name);
        return textResult(`Pokemon ${offset + 1}-${offset + names.length} of ${list.count}:\n${names.join(", ")}`, { list });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-type",
    {
      title: "Get Type",
      description: "Get Pokemon type damage relations and sample Pokemon for a type.",
      inputSchema: z.object({
        type: z.string().describe("Type name, e.g. electric, water, fire."),
        pokemonLimit: z.number().int().min(1).max(50).default(15),
      }),
    },
    async ({ type, pokemonLimit }) => {
      try {
        const data = await api.get<TypeResource>(`/type/${normalizeIdentifier(type)}`);
        const relations = Object.fromEntries(
          Object.entries(data.damage_relations).map(([key, values]) => [key, values.map((item) => item.name)]),
        );
        const pokemon = data.pokemon.slice(0, pokemonLimit).map((item) => item.pokemon.name);
        return textResult(
          [`Type: ${data.name}`, `Double damage to: ${relations.double_damage_to?.join(", ") || "none"}`, `Weak to: ${relations.double_damage_from?.join(", ") || "none"}`, `Sample Pokemon: ${pokemon.join(", ")}`].join("\n"),
          { type: data.name, damageRelations: relations, pokemon },
        );
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-ability",
    {
      title: "Get Ability",
      description: "Get an ability effect and Pokemon that can have it.",
      inputSchema: z.object({
        ability: z.string(),
        pokemonLimit: z.number().int().min(1).max(50).default(20),
      }),
    },
    async ({ ability, pokemonLimit }) => {
      try {
        const data = await api.get<Ability>(`/ability/${normalizeIdentifier(ability)}`);
        const effect = englishEntry(data.effect_entries);
        const pokemon = data.pokemon.slice(0, pokemonLimit).map((item) => ({ name: item.pokemon.name, hidden: item.is_hidden }));
        return textResult(
          [`Ability: ${data.name}`, effect?.short_effect ? `Effect: ${effect.short_effect}` : undefined, `Pokemon: ${pokemon.map((item) => `${item.name}${item.hidden ? " (hidden)" : ""}`).join(", ")}`].filter(Boolean).join("\n"),
          { ability: data.name, effect: effect?.effect, pokemon },
        );
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-move",
    {
      title: "Get Move",
      description: "Get move type, power, accuracy, PP, target, and effect.",
      inputSchema: z.object({
        move: z.string(),
      }),
    },
    async ({ move }) => {
      try {
        const data = await api.get<Move>(`/move/${normalizeIdentifier(move)}`);
        const effect = englishEntry(data.effect_entries);
        return textResult(
          [`Move: ${data.name}`, `Type: ${data.type.name} | Class: ${data.damage_class.name}`, `Power: ${data.power ?? "n/a"} | Accuracy: ${data.accuracy ?? "n/a"} | PP: ${data.pp ?? "n/a"}`, `Target: ${data.target.name}`, effect?.short_effect ? `Effect: ${effect.short_effect}` : undefined].filter(Boolean).join("\n"),
          { move: data.name, type: data.type.name, damageClass: data.damage_class.name, power: data.power, accuracy: data.accuracy, pp: data.pp, effect: effect?.effect },
        );
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get-evolution-chain",
    {
      title: "Get Evolution Chain",
      description: "Get the evolution chain for a Pokemon by resolving its species.",
      inputSchema: z.object({
        pokemon: z.union([z.string(), z.number()]),
      }),
    },
    async ({ pokemon }) => {
      try {
        const data = await api.get<Pokemon>(`/pokemon/${normalizeIdentifier(pokemon)}`);
        const species = await api.get<PokemonSpecies>(data.species.url);
        const evolution = await api.get<EvolutionChain>(species.evolution_chain.url);
        const flattened = flattenEvolution(evolution.chain);
        const lines = flattened.map((item) => `${"  ".repeat(item.depth)}- ${item.name}`);
        return textResult(`Evolution chain for ${data.name}:\n${lines.join("\n")}`, { pokemon: data.name, chain: flattened });
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  return server;
}

void serveStdio(createServer);
