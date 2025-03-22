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

  function placeShip(coordinatesArray, shipLength, random = false) {
    function checkPlacement(coords) {
      // reject out of bounds
      if (coords[0] < 0 || coords[0] > 9 || coords[1] < 0 || coords[1] > 9) {
        return false;
      }
      // reject ship being placed on another ship
      for (let ship of ships) {
        for (let placedCoords of ship.coordinatesArray) {
          if (coords[0] === placedCoords[0] && coords[1] === placedCoords[1]) {
            return false;
          }
        }
      }

      return true;
    }

    function createRandomShipPlacement() {
      let shipCoordinatesArray = [];
      const directions = { up: -1, down: 1, left: -1, right: 1 };
      const directionKeys = Object.keys(directions);

      while (shipCoordinatesArray.length < shipLength) {
        // Resets array if previous coords didn't work
        shipCoordinatesArray = [];
        const randomCoordinates = [
          Math.floor(Math.random() * 9),
          Math.floor(Math.random() * 9),
        ];
        if (!checkPlacement(randomCoordinates)) {
          continue;
        } else {
          shipCoordinatesArray.push(randomCoordinates);
        }
        // Based on random number between 0 and the number of directions
        const randomDirection =
          directionKeys[Math.floor(Math.random() * directionKeys.length)];
        let newCoordinates = randomCoordinates;
        for (let i = 0; i < shipLength - 1; i++) {
          if (randomDirection === "up" || randomDirection === "down") {
            newCoordinates = [
              newCoordinates[0],
              newCoordinates[1] + directions[randomDirection],
            ];
          } else {
            // left or right
            newCoordinates = [
              newCoordinates[0] + directions[randomDirection],
              newCoordinates[1],
            ];
          }

          if (!checkPlacement(newCoordinates)) {
            break;
          } else {
            shipCoordinatesArray.push(newCoordinates);
          }
        }
      }

      return shipCoordinatesArray;
    }

    if (random) {
      coordinatesArray = createRandomShipPlacement();
    } else {
      for (let coords of coordinatesArray) {
        if (!checkPlacement(coords)) return false;
      }
    }

    const ship = createShip(shipLength);
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

export function createPlayer(isReal) {
  const gameboard = createGameboard();
  return { isReal, gameboard };
}
