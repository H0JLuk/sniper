
/**
 * Creates an AccuracyMeter, which keeps track of hits and misses, 
 * and manages the summary of the accuracy on the page.
 *
 * @return <AccuracyMeter> new AccuracyMeter
 *
 * @author Kevin Avery (kevin@avery.io)
 */
Sniper.createAccuracyMeter = function() {
  var hits = 0,
      misses = 0,
      accuracyEl = document.getElementById('accuracy'),
      updateDisplay,
      addHit,
      addMiss,
      getHits;

  /**
   * Updates the accuracy summary on the page.
   */
  updateDisplay = function() {
    var total = hits + misses,
        percent = Math.floor((hits / total) * 100);

    accuracyEl.innerHTML = hits + '/' + total + ' (' + percent + '%)';
  };

  /**
   * Increments the number of hits and updates summary.
   */
  addHit = function() {
    hits++;
    updateDisplay();
  };

  /**
   * Increments the number of misses and updates summary.
   */
  addMiss = function() {
    misses++;
    updateDisplay();
  };

  /**
   * @return <Number> number of hits
   */
  getHits = function() {
    return hits;
  };

  var accuracyMeter = {};
  accuracyMeter.addHit = addHit;
  accuracyMeter.addMiss = addMiss;
  accuracyMeter.getHits = getHits;
  return accuracyMeter;
};
