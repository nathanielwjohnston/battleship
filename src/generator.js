export function createShip(length) {
  let timesHit = 0;

  const hit = () => ++timesHit;

  function isSunk() {
    if (timesHit >= length) return true;

    return false;
  }

  return { hit, isSunk };
}

let gameboardIndex = 0;

export function createGameboard() {
  const ships = [];
  const hits = [];
  const misses = [];
  const boardIndex = gameboardIndex;
  gameboardIndex += 1;

  function placeShip(coordinatesArray, shipLength, random = false) {
    let direction;

    const directions = {
      up: [0, -1],
      down: [0, 1],
      left: [-1, 0],
      right: [1, 0],
    };
    const directionKeys = Object.keys(directions);

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

      while (shipCoordinatesArray.length < shipLength) {
        // Resets array if previous coords didn't work
        shipCoordinatesArray = [];
        const gameboardWidth = 10;
        const randomCoordinates = [
          Math.floor(Math.random() * (gameboardWidth - 1)),
          Math.floor(Math.random() * (gameboardWidth - 1)),
        ];
        if (!checkPlacement(randomCoordinates)) continue;

        shipCoordinatesArray.push(randomCoordinates);

        // Based on random number between 0 and the number of directions
        const randomDirection =
          directionKeys[Math.floor(Math.random() * directionKeys.length)];
        direction = randomDirection;
        let newCoordinates = randomCoordinates;
        for (let i = 0; i < shipLength - 1; i++) {
          newCoordinates = [
            newCoordinates[0] + directions[randomDirection][0],
            newCoordinates[1] + directions[randomDirection][1],
          ];

          if (!checkPlacement(newCoordinates)) break;

          shipCoordinatesArray.push(newCoordinates);
        }
      }

      return shipCoordinatesArray;
    }

    if (random) {
      const coordinatesArrayItem = createRandomShipPlacement();
      coordinatesArray = coordinatesArrayItem;
    } else {
      for (let coords of coordinatesArray) {
        if (!checkPlacement(coords)) return false;
      }

      // Get direction of manually placed ship
      getDirection: {
        if (shipLength === 1) {
          direction = "single";
          break getDirection;
        }

        const firstSquare = coordinatesArray[0];
        const secondSquare = coordinatesArray[1];

        const difference = [
          secondSquare[0] - firstSquare[0],
          secondSquare[1] - firstSquare[1],
        ];

        direction = directionKeys.find((key) => {
          if (
            directions[key][0] === difference[0] &&
            directions[key][1] === difference[1]
          ) {
            return true;
          }
        });
      }
    }

    const ship = createShip(shipLength);
    ships.push({
      shipObject: ship,
      coordinatesArray,
      direction,
      length: shipLength,
    });

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

  function checkSquareAttacked(coordinates) {
    for (let hit of hits) {
      if (hit[0] === coordinates[0] && hit[1] === coordinates[1]) {
        return true;
      }
    }

    for (let miss of misses) {
      if (miss[0] === coordinates[0] && miss[1] === coordinates[1]) {
        return true;
      }
    }

    return false;
  }

  return {
    placeShip,
    receiveAttack,
    checkRemainingShips,
    checkSquareAttacked,
    misses,
    hits,
    ships,
    boardIndex,
  };
}

export function createPlayer(isReal) {
  const gameboard = createGameboard();
  return { isReal, gameboard };
}
