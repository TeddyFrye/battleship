// Ship Factory Function
function Ship(length) {
  let hitCount = 0;

  function hit() {
    if (hitCount < length) {
      hitCount++;
    }
  }

  function isSunk() {
    return hitCount >= length;
  }

  return { length, hit, isSunk };
}
