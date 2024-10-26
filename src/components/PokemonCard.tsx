import React from 'react';
import { Card, CardMedia, CardHeader } from '@mui/material';

interface CardProps {
  name: string;
  id: string;
  image: string;
}

export const PokemonCard: React.FC<CardProps> = ({ name, id, image }) => {

return (
    <Card>
        <CardMedia
          component="img"
          height="100"
          image={image}
          alt={name}
        />
        <CardHeader title={name} subheader={id}/>
    </Card>
  );
}