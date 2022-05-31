import { createGame, createGameEngine, createSoundPlayer } from './scripts/index';
import type { SoundType } from './scripts/types';

import bldBgImgPath from './images/bld_bg.jpg';
import bldFgImgPath from './images/bld_fg.png';
import enemyImgPath from './images/enemy.png';
import enemyShootingImgPath from './images/enemy_shooting.png';
import scopeImgPath from './images/scope.png';

import sniperSoundPath from './sounds/sniper_fire.mp3';
import m16SoundPath from './sounds/m16_fire.mp3';

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

      const game = createGameEngine();

      socket.onopen = (ev) => {
        console.log('[OPEN]', ev);
      };

      socket.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        console.log('[MSG]', data);

        if (data.type === 'SHOW') {
          game.start(
            createGame({
              bldBgImg,
              bldFgImg,
              enemyImg,
              enemyShootingImg,
              scopeImg,
              sniperSound,
              m16Sound,
              serverEnemies: data.data,
            })
          );
        }
      };

      socket.onclose = (ev) => {
        console.log('[CLOSE]', ev);
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
