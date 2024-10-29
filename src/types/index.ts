export interface Pokemon {
    name: string;
    id: number;
    image: string;
    height: number;
    weight: number;
    types: string[];
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  }
  
  export interface Column {
    id: keyof Pokemon;
    label: string;
    hideable: boolean;
    width: number | string;
  }