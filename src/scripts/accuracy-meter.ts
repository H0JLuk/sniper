const createAccuracyMeter = () => {
  let hits = 0,
    misses = 0;
  const accuracyEl = document.getElementById('accuracy');

  const updateDisplay = () => {
    const total = hits + misses,
      percent = Math.floor((hits / total) * 100);
    accuracyEl.innerHTML = hits + '/' + total + ' (' + percent + '%)';
  };

  const addHit = () => {
    hits++;
    updateDisplay();
  };

  const addMiss = () => {
    misses++;
    updateDisplay();
  };

  return {
    addHit,
    addMiss,
    get hits() {
      return hits;
    },
  };
};

export default createAccuracyMeter;
