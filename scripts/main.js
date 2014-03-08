
/**
 * The 'main' function. It loads the resources and
 * starts up a game.
 *
 * @author Kevin Avery (kevin@avery.io)
 */
Sniper.main = function() {
  var windowReady = false,
      bldBgImg,
      bldFgImg,
      enemyImg,
      enemyShootingImg,
      scopeImg,
      sniperSound,
      m16Sound,
      loadImg,
      syncLoad;

  /**
   * Asynchronously loads an image, calling binder
   * so that the image may be bound to a variable.
   *
   * @param <String> filename
   * @param <Function> binder
   */
  loadImg = function(filename, binder) {
    var img = new Image();
    img.onload = function() {
      binder(img);
      syncLoad();
    };
    img.src = filename;
  };

  /**
   * Creates and starts the game only if it
   * is called when all the resources are loaded.
   *
   * This is necessary since most most resources load 
   * asynchronously.
   */
  syncLoad = function() {
    if (windowReady && bldBgImg && bldFgImg &&
      enemyImg && enemyShootingImg && scopeImg) {

      Sniper.createGameEngine().start(Sniper.createGame({
        bldBgImg: bldBgImg,
        bldFgImg: bldFgImg,
        enemyImg: enemyImg,
        enemyShootingImg: enemyShootingImg,
        scopeImg: scopeImg,
        sniperSound: sniperSound,
        m16Sound: m16Sound
      }));
    }
  };

  /**
   * Initiate things after the window loads.
   */
   (function() {
    var audioElement, canPlayOgg, soundFileExt;

    // Tried grabbing images from the DOM - didn't work
    loadImg('images/bld_bg.jpg', function(img) { bldBgImg = img; });
    loadImg('images/bld_fg.png', function(img) { bldFgImg = img; });
    loadImg('images/enemy.png', function(img) { enemyImg = img; });
    loadImg('images/enemy_shooting.png', function(img) { enemyShootingImg = img; });
    loadImg('images/scope.png', function(img) { scopeImg = img; });

    // Sigh, IE and Safari don't support OGG audio...
    audioElement = document.createElement('audio'),
    canPlayOgg = typeof audioElement.canPlayType === 'function' &&
                 audioElement.canPlayType('audio/ogg') !== '';
    soundFileExt = canPlayOgg ? 'ogg' : 'mp3';

    sniperSound = Sniper.createSoundPlayer('sounds/sniper_fire.' + soundFileExt, 10);
    m16Sound = Sniper.createSoundPlayer('sounds/m16_fire.' + soundFileExt, 20, 0.2);
    
    windowReady = true;
    syncLoad();
  })();
};
