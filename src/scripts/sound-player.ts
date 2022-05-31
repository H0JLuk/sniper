const createSoundPlayer = (filename: string, numConcurrent: number, volume = 1) => {
  const sounds = <HTMLAudioElement[]>[];
  let soundIndex: number;

  const play = () => {
    sounds[soundIndex].play();
    soundIndex = soundIndex + 1 === numConcurrent ? 0 : soundIndex + 1;
  };

  (() => {
    for (soundIndex = 0; soundIndex < numConcurrent; soundIndex++) {
      sounds[soundIndex] = new Audio(filename);
      // sounds[soundIndex].load();
      sounds[soundIndex].volume = volume;
    }

    soundIndex = 0;
  })();

  return { play };
};

export default createSoundPlayer;
