import React, { useState, useEffect } from 'react';
import './App.css';
import { PokemonCard } from './components/PokemonCard';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/';

interface Pokemon {
  name: string;
  id: string;
  image: string;
}

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => { 
    const fetchPokemon = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemonItem: { name: string; url: string }) => {
            const res = await fetch(pokemonItem.url);
            const details = await res.json();
            return {
              name: details.name,
              id: details.id,
              image: details.sprites.front_default,
            } as Pokemon;
          })
        );

        setPokemon(pokemonDetails);
      } catch (err) {
        setError('Failed to fetch Pokémon data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="App">
      {pokemon.map((pokemon) => (
        <PokemonCard key={pokemon.id} name={pokemon.name} id={pokemon.id} image={pokemon.image} />))}
    </div>
  );
}

export default App;
