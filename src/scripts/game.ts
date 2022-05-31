import { createAccuracyMeter, createEnemy } from './index';
import type { ServerEnemy, SoundType } from './types';

type Enemy = ReturnType<typeof createEnemy>;

const OSCILLATION_AMPLITUDE = 5,
  OSCILLATION_FREQ_FACTOR = 0.05,
  RECOIL_DURATION = 10,
  RECOIL_AMPLITUDE = 1.5,
  BG_COLOR = '#060606';

type CreateGameArgs = {
  bldBgImg: HTMLImageElement;
  bldFgImg: HTMLImageElement;
  enemyImg: HTMLImageElement;
  enemyShootingImg: HTMLImageElement;
  scopeImg: HTMLImageElement;
  sniperSound: SoundType;
  m16Sound: SoundType;
  serverEnemies: ServerEnemy[];
};

const createGame = ({
  bldBgImg,
  bldFgImg,
  enemyImg,
  enemyShootingImg,
  scopeImg,
  sniperSound,
  m16Sound,
  serverEnemies,
}: CreateGameArgs) => {
  const can = <HTMLCanvasElement>document.getElementById('game-canvas'),
    ctx = can.getContext('2d');

  let oscCounter = 0,
    recoilCounter = 0;

  const enemies = <Enemy[]>[];

  let lastEnemyShot: Enemy | undefined,
    curSpawnBuilding: Enemy[] | undefined,
    enemiesByBuilding: Enemy[][] | undefined,
    clickWaiting = false,
    scopeLeft = 9,
    scopeTop = 0;

  let xOffset = 0,
    yOffset = 0,
    moveX = 0,
    moveY = 0;

  window.onresize = setWindowAndScope;
  setWindowAndScope();

  initializeEnemies();
  console.log(1);

  const accuracyMeter = createAccuracyMeter();

  can.onmousemove = (evt) => {
    moveX = evt.pageX;
    moveY = evt.pageY;
  };

  can.onmousedown = () => {
    clickWaiting = true;
  };

  function setWindowAndScope() {
    // Make sure we always draw full screen
    // can.width = document.body.clientWidth;
    can.width = window.innerWidth;
    can.height = window.innerHeight - document.getElementById('title-container').clientHeight;

    // Calculate scope position
    scopeLeft = (can.width - scopeImg.width) / 2;
    scopeTop = (can.height - scopeImg.height) / 2;
  }

  /**
   * Populates `enemiesByBuilding`, which is an array where each
   * element is an array of enemies representing a different building.
   *
   * Also chooses and random `curSpawnBuilding` from `enemiesByBuilding`.
   */
  function initializeEnemies() {
    // Positions are in the form of [left, top, width, height, -bodyHeight]
    // used for checking shots fired. The -bodyHeight is positive when the
    // building foreground partially eclipses the enemy.
    const bld0EnemyPositions = [
      [500, 1090, 43, 43, 28],
      [600, 1100, 43, 43, 36],
      [800, 1100, 43, 43, 28],
      [940, 1120, 43, 43, 32],
    ];

    const bld1EnemyPositions = [
      [2060, 824, 43, 43, 34],
      [2160, 822, 43, 43, 28],
      [2350, 836, 43, 43, 26],
    ];

    const bld2EnemyPositions = [
      [3180, 760, 43, 43, 26],
      [3300, 770, 43, 43, 32],
      [3600, 776, 43, 43, 26],
    ];

    // const enemiesByBuilding = serverEnemies.map((i) => createEnemies(i));

    const enemiesByBuilding = [
      createEnemies(bld0EnemyPositions),
      createEnemies(bld1EnemyPositions),
      createEnemies(bld2EnemyPositions),
    ];

    enemiesByBuilding.forEach(function (bld) {
      bld.forEach(function (e) {
        enemies.push(e);
      });
    });

    curSpawnBuilding = chooseRandom(enemiesByBuilding);
  }

  function chooseRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function createEnemies(positions: number[][]) {
    const createdEnemies = positions.map((p) => createEnemy(p, m16Sound));
    return createdEnemies;
  }

  /**
   * Attempts to spawn an Enemy. Note that an enemy
   * may not actually be spawned.
   */
  function spawnEnemy() {
    // Probabilistically change spawn building
    if (Math.random() > 0.5) {
      curSpawnBuilding = chooseRandom(enemiesByBuilding);
    }

    // Grab a new enemy from current building.
    // Loop expires if it's taking too many tries to find a
    // valid new enemy to spawn. This could be improved by
    // keeping track of the non-visible enemies.
    for (let numTries = 0; numTries < 10; numTries++) {
      const newEnemy = chooseRandom(curSpawnBuilding);

      if (!newEnemy.isVisible() && newEnemy !== lastEnemyShot) {
        newEnemy.show();
        break;
      }
    }
  }

  function calcVisibleEnemies() {
    const numHits = accuracyMeter.hits;
    if (numHits < 5) {
      return 1;
    } else if (numHits < 25) {
      return 2;
    } else if (numHits < 50) {
      return 3;
    } else {
      return 4;
    }
  }

  function update() {
    // Don't take shot during recoil
    if (recoilCounter > 0) {
      clickWaiting = false;
    }

    // Handle shot
    if (clickWaiting) {
      clickWaiting = false;
      recoilCounter = 1;
      sniperSound.play();

      let anyHit = false;
      enemies.forEach(function (e) {
        const hit = e.tryShot(can.width / 2 - xOffset, can.height / 2 - yOffset);
        if (hit) {
          lastEnemyShot = e;
          anyHit = true;
        }
      });

      if (anyHit) {
        // Even Chuck Norris can only make one hit per frame.
        accuracyMeter.addHit();
      } else {
        accuracyMeter.addMiss();
      }
    }

    // Adjust oscilation counter
    oscCounter = oscCounter > Math.PI * 100 ? 0 : oscCounter + OSCILLATION_FREQ_FACTOR;

    // Adjust recoil as necessary
    if (recoilCounter > RECOIL_DURATION) {
      recoilCounter = 0;
    } else if (recoilCounter > 0) {
      recoilCounter++;
    }

    // Update all enemies and spawn some if necessary
    let numVisibleEnemies = 0;
    enemies.forEach(function (e) {
      e.update();

      if (e.isVisible()) {
        numVisibleEnemies++;
      }
    });

    if (numVisibleEnemies < calcVisibleEnemies()) {
      spawnEnemy();
    }
  }

  function draw() {
    // Do y-axis oscillation
    const yOscillation = Math.sin(oscCounter) * OSCILLATION_AMPLITUDE;

    // Do y-axis recoil
    const yRecoil = Math.pow(recoilCounter - RECOIL_DURATION, 2) * Math.sin(recoilCounter) * RECOIL_AMPLITUDE;

    // Move image much farther than user moves mouse
    const cursorScaleFactor = (bldBgImg.width / can.width) * 2;
    xOffset = bldBgImg.width / 2 - moveX * cursorScaleFactor;
    yOffset = bldBgImg.height / 2 - moveY * cursorScaleFactor + yOscillation + yRecoil;

    // Force offsets so that we never move past edge of image
    if (scopeLeft - xOffset < 0) {
      xOffset = scopeLeft;
    } else if (bldBgImg.width - scopeLeft - scopeImg.width + xOffset < 0) {
      xOffset = -bldBgImg.width + scopeLeft + scopeImg.width;
    }

    if (scopeTop - yOffset < 0) {
      yOffset = scopeTop;
    } else if (bldBgImg.height - scopeTop - scopeImg.height + yOffset < 0) {
      yOffset = -bldBgImg.height + scopeTop + scopeImg.height;
    }

    // Clear the entire canvas
    ctx.clearRect(0, 0, can.width, can.height);

    // Draw the background
    ctx.drawImage(bldBgImg, xOffset, yOffset, bldBgImg.width, bldBgImg.height);

    // Draw the enemies
    enemies.forEach((e) => {
      if (e.isVisible()) {
        const img = e.isShooting() ? enemyShootingImg : enemyImg; // TODO:
        ctx.drawImage(img, xOffset + e.getX(), yOffset + e.getY(), img.width, img.height);

        //DEBUG body targets
        // r = e.getRegion();
        // ctx.fillStyle = "#00FF00";
        // ctx.fillRect(xOffset + r[0], yOffset + r[1], r[2], r[3]);
      }
    });

    // Draw the foreground
    ctx.drawImage(bldFgImg, xOffset, yOffset, bldBgImg.width, bldBgImg.height);

    // Draw the scope
    ctx.drawImage(scopeImg, scopeLeft, scopeTop, scopeImg.width, scopeImg.height);
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, scopeLeft + 10, can.height);
    ctx.fillRect(0, 0, can.width, scopeTop + 10);
    ctx.fillRect(scopeLeft + scopeImg.width - 10, 0, can.width, can.height);
    ctx.fillRect(0, scopeTop + scopeImg.height - 10, can.width, can.height);

    // Center dot
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(can.width / 2 - 2, can.height / 2 - 2, 4, 4);
  }

  return { draw, update };
};

export default createGame;
