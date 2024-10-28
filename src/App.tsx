import React, { useState, useEffect } from 'react';
import './App.css';
import { PokemonTable } from './components/PokemonTable';

const API_URL = 'https://pokeapi.co/api/v2/pokemon?limit=151';


interface Pokemon {
  name: string;
  id: number;
  image: string;
  weight: number;
  height: number;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
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
              height: details.height,
              weight: details.weight,
              types: details.types.map((type: any) => type.type.name),
              hp: details.stats[0].base_stat,
              attack: details.stats[1].base_stat,
              defense: details.stats[2].base_stat,
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
      
      <div className='Header'>
        <h1 className='HeaderText'>PokémonDB</h1>
      </div>

      <PokemonTable pokemonData={pokemon}/>
    </div>
  );
}

export default App;
