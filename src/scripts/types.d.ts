import createSoundPlayer from './sound-player';

export type SoundType = ReturnType<typeof createSoundPlayer>;

export type ServerEnemy = {
  name: string;
  id: number;
  coords: number[];
};
