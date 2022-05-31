import { createGame } from '.';

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

  // const update = (game: Game) => {
  //   stop();

  //   timer = setInterval(() => {

  //   })
  // }

  const stop = () => timer && clearInterval(timer);

  return { start, stop };
};

export default createGameEngine;
