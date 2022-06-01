import { createGame } from '.';
import { ServerEnemy } from './types';

const UPDATES_PER_SECOND = 30;
const REFRESH_TIME = 1000 / UPDATES_PER_SECOND;

type Game = ReturnType<typeof createGame>;

const createGameEngine = () => {
  let timer: NodeJS.Timer | undefined;

  const start = (game: Game) => {
    stop();

    timer = setInterval(() => {
      game.update();
      game.draw();
    }, REFRESH_TIME);
  };

  const addPlayer = (game: Game, enemy: ServerEnemy) => {
    stop();
    game.addPlayer(enemy);
    start(game);
  };

  const movePlayer = (game: Game, enemy: ServerEnemy) => {
    stop();
    game.movePlayer(enemy);
    start(game);
  };

  const removePlayer = (game: Game, enemyId: number) => {
    stop();
    game.removePlayer(enemyId);
    start(game);
  };

  const stop = () => timer && clearInterval(timer);

  return { start, addPlayer, movePlayer, removePlayer, stop };
};

export default createGameEngine;
