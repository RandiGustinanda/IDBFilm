import { registerRootComponent } from 'expo';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import MovieDetailsScreen from './MovieDetailsScreen';
import { Movie } from './tmdbAPI';

export type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movie: Movie };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator 
    screenOptions={{
      headerShown: false,
    }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'IDBFilm' }}
      />
      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen} 
        options={{ 
          headerBackTitle: 'Back',
          headerTransparent: false,
        }}
      />
    </Stack.Navigator>
  );
}

registerRootComponent(App);