import { createGameEngine } from '.';
import createGame from './game';
import createSoundPlayer from './sound-player';

export type Game = ReturnType<typeof createGame>;
export type GameEngine = ReturnType<typeof createGameEngine>;

export type SoundType = ReturnType<typeof createSoundPlayer>;

export type ServerEnemy = {
  name: string;
  id: number;
  coords: number[];
};
