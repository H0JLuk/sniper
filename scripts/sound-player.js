
/**
 * Creates a SoundPlayer, which allows for playing a sound 
 * file multiple times concurrently.
 *
 * @param <String> name of sound file
 * @param <Number> number of times this should be able to
 *                 play sound concurrently
 * @param <Number> volume between 1.0 (default) and 0.0
 * @return <SoundPlayer> new SoundPlayer
 *
 * @author Kevin Avery (kevin@avery.io)
 */
Sniper.createSoundPlayer = function(filename, numConcurrent, volume) {
  var sounds = [],
      soundIndex,
      play;

  /**
   * Plays the sound.
   */
  play = function() {
    sounds[soundIndex].play();
    soundIndex = (soundIndex + 1 === numConcurrent) ? 0 : soundIndex + 1;
  };

  // Finish construction of SoundPlayer.
  (function() {
    for (soundIndex = 0; soundIndex < numConcurrent; soundIndex++) {
      sounds[soundIndex] = new Audio(filename);
      sounds[soundIndex].load();
      sounds[soundIndex].volume = volume || 1.0;
    }

    soundIndex = 0;
  })();

  var soundPlayer = {};
  soundPlayer.play = play;
  return soundPlayer;
};
