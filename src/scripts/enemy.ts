import { SoundType } from './types';

const createEnemy = (pos: number[], m16Sound: SoundType) => {
  const COUNTER_RESET_PERIOD = 40,
    NUM_AIM_PERIODS = 1;

  let visible = false,
    shooting = false,
    headRegion: number[],
    bodyRegion: number[],
    counter = 0,
    aimPeriods = 0;

  initRegions();

  /**
   * Initializes the head and body regions that can be
   * used to determine if this has been shot.
   */
  function initRegions() {
    headRegion = [pos[0] + pos[2] * 0.5, pos[1] + pos[3] * 0.1, pos[2] * 0.25, pos[3] * 0.35];

    bodyRegion = [
      pos[0] + pos[2] * 0.1,
      headRegion[1] + headRegion[3], // right below headRegion
      pos[2] * 0.8,
      pos[3] - pos[4], // trim off the bottom of the body
    ];
  }

  /**
   * Determines if a set of coordinates are within a region.
   *
   * @param <Array> region to check
   * @param <Number> x coordinate
   * @param <Number> y coordinate
   * @param <Boolean> true iif coordinates are within region
   */
  function inside(region: number[], x: number, y: number) {
    return x >= region[0] && x <= region[0] + region[2] && y >= region[1] && y <= region[1] + region[3];
  }

  /**
   * Used for debugging positioning of enemy regions...
   */
  function getRegion() {
    return bodyRegion;
  }

  /**
   * Restarts this Enemy and makes it visible.
   */
  function show() {
    counter = 0;
    aimPeriods = 0;
    visible = true;
    shooting = false;
  }

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
  function tryShot(x: number, y: number) {
    if (!visible) {
      return false;
    }

    const hit = inside(bodyRegion, x, y) || inside(headRegion, x, y);

    if (hit) {
      counter = 0;
      aimPeriods = 0;
      visible = false;
      shooting = false;
    }

    return hit;
  }

  /**
   * Updates this Enemy. Should be called every time game
   * logic is updated.
   */
  function update() {
    if (!visible) {
      return;
    }

    if (aimPeriods > NUM_AIM_PERIODS) {
      if (counter === 20) {
        m16Sound.play();
      }

      if (counter > 20 && counter < 40) {
        shooting = !!(counter % 2);
      } else {
        shooting = false;
      }
    }

    counter++;
    // Reset the counter at semi-random intervals
    if (counter >= COUNTER_RESET_PERIOD + Math.random() * 2 * COUNTER_RESET_PERIOD) {
      counter = 0;
      aimPeriods++;
    }
  }

  /**
   * @return <Boolean> true iif currently visible
   */
  function isVisible() {
    return visible;
  }

  function isShooting() {
    return shooting;
  }

  /**
   * @return <Boolean> x coordinate of Enemy
   */
  function getX() {
    return pos[0];
  }

  /**
   * @return <Boolean> y coordinate of Enemy
   */
  function getY() {
    return pos[1];
  }

  return {
    getRegion,
    show,
    tryShot,
    update,
    isVisible,
    isShooting,
    getX,
    getY,
  };
};

export default createEnemy;
