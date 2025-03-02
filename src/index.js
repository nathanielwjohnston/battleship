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

export function createGameboard() {
  const ships = [];
  const hits = [];
  const misses = [];

  function placeShip(coordinatesArray, length) {
    const ship = createShip(length);
    ships.push({ shipObject: ship, coordinatesArray });

    return true;
  }

  function receiveAttack(coordinates) {
    for (let ship of ships) {
      const gridSquares = ship.coordinatesArray;
      for (let gridSquare of gridSquares) {
        if (
          gridSquare[0] === coordinates[0] &&
          gridSquare[1] === coordinates[1]
        ) {
          ship.shipObject.hit();
          hits.push(coordinates);
          // Remove coordinate from ship - is essentially moved over to hits
          gridSquares.splice(gridSquares.indexOf(gridSquare), 1);
          // Remove ship from ships
          if (!gridSquares.length) {
            ships.splice(ships.indexOf(ship), 1);
          }
          return true;
        }
      }
    }

    misses.push(coordinates);
    return false;
  }

  function checkRemainingShips() {
    return ships.length;
  }

  return { placeShip, receiveAttack, checkRemainingShips, misses, hits, ships };
}
