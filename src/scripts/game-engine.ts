const UPDATES_PER_SECOND = 30;
const REFRESH_TIME = 1000 / UPDATES_PER_SECOND;

const createGameEngine = () => {
  let timer: NodeJS.Timer | undefined;

  const start = (game: any) => {
    stop();

    timer = setInterval(() => {
      game.update();
      game.draw();
    }, REFRESH_TIME);
  };

  const stop = () => timer && clearInterval(timer);

  return { start, stop };
};

export default createGameEngine;
