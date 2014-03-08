
/**
 * Creates an Enemy.
 *
 * The Enemy manages its behavior and can determine if it has
 * been shot. 
 *
 * Note that an Enemy object is designed to live
 * throughout the life of the Game, changing between
 * visible and not visible.
 * 
 * @param <Object> position of this object
 * @param <SoundPlayer> m16 sound this enemy makes when shooting
 * @return <Enemy> new Enemy
 *
 * @author Kevin Avery (kevin@avery.io)
 */
Sniper.createEnemy = function(pos, m16Sound) {
  var COUNTER_RESET_PERIOD = 40,
      NUM_AIM_PERIODS = 1;

  var visible = false,
      shooting = false,
      headRegion,
      bodyRegion,
      counter,
      aimPeriods,
      initRegions,
      inside,
      getRegion,
      show,
      tryShot,
      update,
      isVisible,
      isShooting,
      getX,
      getY;

  /**
   * Initializes the head and body regions that can be
   * used to determine if this has been shot.
   */
  initRegions = function() {
    headRegion = [
      pos[0] + pos[2] * 0.5,
      pos[1] + pos[3] * 0.1,
      pos[2] * 0.25,
      pos[3] * 0.35
    ];

    bodyRegion = [
      pos[0] + pos[2] * 0.10,
      headRegion[1] + headRegion[3], // right below headRegion
      pos[2] * 0.8,
      pos[3] - pos[4] // trim off the bottom of the body
    ];
  };

  /**
   * Determines if a set of coordinates are within a region.
   *
   * @param <Array> region to check
   * @param <Number> x coordinate
   * @param <Number> y coordinate
   * @param <Boolean> true iif coordinates are within region
   */
  inside = function(region, x, y) {
    return (x >= region[0]) && (x <= region[0] + region[2]) &&
           (y >= region[1]) && (y <= region[1] + region[3]);
  };

  /**
   * Used for debugging positioning of enemy regions...
   */
  getRegion = function() {
    return bodyRegion;
  };

  /**
   * Restarts this Enemy and makes it visible.
   */
  show = function() {
    counter = 0;
    aimPeriods = 0;
    visible = true;
    shooting = false;
  };

  /**
   * Determines whether the provided coordinates hit this
   * Enemy. If so this Enemy becomes resets and becomes invisible.
   * 
   * Simply returns false if this Enemy is not visible.
   *
   * @param <Number> x coordinate
   * @param <Number> y coordinate
   * @return <Boolean> true iif Enemy was visible and shot hit.
   */
  tryShot = function(x, y) {
    if (!visible) {
      return false;
    }

    var hit = inside(bodyRegion, x, y) || inside(headRegion, x, y);

    if (hit) {
      counter = 0;
      aimPeriods = 0;
      visible = false;
      shooting = false;
    }

    return hit;
  };

  /**
   * Updates this Enemy. Should be called every time game
   * logic is updated.
   */
  update = function() {
    if (!visible) {
      return;
    }

    if (aimPeriods > NUM_AIM_PERIODS) {
      if (counter === 20) {
        m16Sound.play();
      }

      if (counter > 20 && counter < 40) {
        shooting = counter % 2;
      }
      else {
        shooting = false;
      }
    }

    counter++;
    // Reset the counter at semi-random intervals
    if (counter >= COUNTER_RESET_PERIOD + Math.random() * 2 * COUNTER_RESET_PERIOD) {
      counter = 0;
      aimPeriods++;
    }
  };

  /**
   * @return <Boolean> true iif currently visible
   */
  isVisible = function() {
    return visible;
  };

  /**
   * @return <Boolean> true iif currently shooting
   */
  isShooting = function() {
    return shooting;
  };

  /**
   * @return <Boolean> x coordinate of Enemy
   */
  getX = function() {
    return pos[0];
  };

  /**
   * @return <Boolean> y coordinate of Enemy
   */
  getY = function() {
    return pos[1];
  };

  // Finish construction of Enemy.
  (function() {
    initRegions();
  })();

  var enemy = {};
  enemy.getRegion = getRegion;
  enemy.show = show;
  enemy.tryShot = tryShot;
  enemy.update = update;
  enemy.isVisible = isVisible;
  enemy.isShooting = isShooting;
  enemy.getX = getX;
  enemy.getY = getY;
  return enemy;
};
