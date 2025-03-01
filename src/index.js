import "./styles.css";

export function createShip(length) {
  let timesHit = 0;

  const hit = () => ++timesHit;

  function isSunk() {
    if (timesHit >= length) return true;

    return false;
  }

  return { hit, isSunk };
}

export function gameboard() {}
