import { createGame, createGameEngine, createSoundPlayer } from './scripts/index';

import bldBgImgPath from './images/bld_bg.jpg';
import bldFgImgPath from './images/bld_fg.png';
import enemyImgPath from './images/enemy.png';
import enemyShootingImgPath from './images/enemy_shooting.png';
import scopeImgPath from './images/scope.png';

import sniperSoundPath from './sounds/sniper_fire.mp3';
import m16SoundPath from './sounds/m16_fire.mp3';

const main = () => {
  let windowReady = false;

  let bldBgImg, bldFgImg, enemyImg, enemyShootingImg, scopeImg;
  let sniperSound, m16Sound;

  const syncLoad = () => {
    if (windowReady && bldBgImg && bldFgImg && enemyImg && enemyShootingImg && scopeImg) {
      createGameEngine().start(
        createGame({
          bldBgImg,
          bldFgImg,
          enemyImg,
          enemyShootingImg,
          scopeImg,
          sniperSound,
          m16Sound,
        })
      );
    }
  };

  const loadImg = (filename, binder) => {
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
