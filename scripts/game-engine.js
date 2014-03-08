

/**
 * Creates probably the simplest 'Game Engine' imaginable.
 *
 * It invokes the Game's update and draw methods at some
 * regular frequency.
 *
 * Note that the update and draw methods are *always* called,
 * and always called consecutively. In other words, we do 
 * not skip frames, which may be bad - if the draw method
 * takes too long, it will push back the next call to 
 * update, and the game logic itself will slow down.
 *
 * This could be fixed by timing the methods and skipping
 * draws when necessary, but that's probably overkill
 * for our purposes.
 *
 * @return <GameEngine> new GameEngine
 *
 * @author Kevin Avery (kevin@avery.io)
 */
Sniper.createGameEngine = function() {
  // Constants
  var UPDATES_PER_SECOND = 30;

  // Private variables
  var timer,
      start,
      stop;

  /**
   * Starts the Game and invokes its update and draw
   * methods on regular intervals.
   *
   * @param <Game> the game to run
   */
  start = function(game) {
    if (timer) {
      stop();
    }

    timer = setInterval(function() {
      game.update();
      game.draw();
    }, 1000 / UPDATES_PER_SECOND);
  };

  /**
   * Halts the Game.
   */
  stop = function() {
    if (timer) {
      clearInterval(timer);
    }
  };

  var gameEngine = {};
  gameEngine.start = start;
  gameEngine.stop = stop;
  return gameEngine;
};
