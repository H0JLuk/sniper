import { createGame, createGameEngine, createSoundPlayer } from './scripts/index';
import type { Game, ServerEnemy, SoundType } from './scripts/types';

import bldBgImgPath from './images/bld_bg.jpg';
import bldFgImgPath from './images/bld_fg.png';
import enemyImgPath from './images/enemy.png';
import enemyShootingImgPath from './images/enemy_shooting.png';
import scopeImgPath from './images/scope.png';

import sniperSoundPath from './sounds/sniper_fire.mp3';
import m16SoundPath from './sounds/m16_fire.mp3';

import MSG from './messages.json';

const main = () => {
  let windowReady = false;

  let bldBgImg: HTMLImageElement,
    bldFgImg: HTMLImageElement,
    enemyImg: HTMLImageElement,
    enemyShootingImg: HTMLImageElement,
    scopeImg: HTMLImageElement;
  let sniperSound: SoundType, m16Sound: SoundType;

  const syncLoad = () => {
    if (windowReady && bldBgImg && bldFgImg && enemyImg && enemyShootingImg && scopeImg) {
      const socket = new WebSocket('ws://localhost:8000');

      const gameEngine = createGameEngine();
      let game: Game;

      socket.onopen = (ev) => {
        console.log('[OPEN]', ev);
      };

      socket.onmessage = (ev) => {
        const message = JSON.parse(ev.data);
        console.log('[MSG]', message);

        document.addEventListener('keyup', function (event) {
          const { key } = event;
          const isLeftKey = ['ArrowLeft', 'a'].includes(key);
          const isRightKey = ['ArrowRight', 'd'].includes(key);
          debugger;
          const side = isLeftKey ? 'LEFT' : isRightKey ? 'RIGHT' : null;

          side &&
            socket.send(
              JSON.stringify({
                side,
                type: MSG.MOVE,
              })
            );
        });

        if (message.type === MSG.SHOW) {
          game = createGame({
            bldBgImg,
            bldFgImg,
            enemyImg,
            enemyShootingImg,
            scopeImg,
            sniperSound,
            m16Sound,
            serverEnemies: message.data,
          });
          gameEngine.start(game);
        }

        if (message.type === MSG.CONNECT) {
          gameEngine.addPlayer(game, message.data as ServerEnemy);
        }

        if (message.type === MSG.LEAVE) {
          gameEngine.removePlayer(game, message.data as number);
        }

        if (message.type === MSG.MOVE) {
          gameEngine.movePlayer(game, message.data as ServerEnemy);
        }

        if (message.type === MSG.ERROR) {
          gameEngine.stop();
          alert(message.data);
          document.querySelector('.subtitle').innerHTML = 'Reload page please';
        }
      };

      socket.onerror = (err) => {
        console.log('[ERR]', err);
      };

      socket.onclose = (ev) => {
        gameEngine.stop();
      };
    }
  };

  const loadImg = (filename: string, binder: (img: HTMLImageElement) => void) => {
    const img = new Image();
    img.src = filename;

    img.onload = () => {
      binder(img);
      syncLoad();
    };
  };

  (() => {
    loadImg(bldBgImgPath, (img) => (bldBgImg = img));
    loadImg(bldFgImgPath, (img) => (bldFgImg = img));
    loadImg(enemyImgPath, (img) => (enemyImg = img));
    loadImg(enemyShootingImgPath, (img) => (enemyShootingImg = img));
    loadImg(scopeImgPath, (img) => (scopeImg = img));

    sniperSound = createSoundPlayer(sniperSoundPath, 10, 0.03);
    m16Sound = createSoundPlayer(m16SoundPath, 20, 0.01);

    windowReady = true;
    syncLoad();
  })();
};

main();
