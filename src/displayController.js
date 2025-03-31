import { createShip, createGameboard, createPlayer } from "../src/generator";
import { setupTurn, verifyTurn } from "./gameController";

function getGridIndex(coords) {
  const gameboardWidth = 10;

  return coords[0] + coords[1] * gameboardWidth;
}

function getDisplayGameboard(player) {
  const gameboards = document.querySelectorAll(".gameboard");

  return gameboards[player.gameboard.boardIndex];
}

export function styleSquareAttack(enemyPlayer, coords, attackResult) {
  const gameboard = getDisplayGameboard(enemyPlayer);

  const gridSquareIndex = getGridIndex(coords);

  const gridSquares = gameboard.querySelectorAll(".grid-square");
  const gridSquare = gridSquares[gridSquareIndex];

  if (attackResult === "hit") {
    gridSquare.classList.add("hit");
  } else {
    gridSquare.classList.add("miss");
  }
}

// not currently using await. the idea is that the code can run elsewhere but
// this may cause issues when calling the setup turn function at the bottom
export async function attackSequence(
  currentPlayer,
  enemyPlayer,
  coords,
  attackResult,
) {
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  const enemyGameboard = getDisplayGameboard(enemyPlayer);
  // Turn on gameboard if computer
  // Wait if computer
  if (!currentPlayer.isReal) {
    enemyGameboard.classList.remove("off");
    await delay(2000);
  }

  const gridSquareIndex = getGridIndex(coords);

  const gridSquares = enemyGameboard.querySelectorAll(".grid-square");
  const gridSquare = gridSquares[gridSquareIndex];

  // Highlight square to be attacked
  gridSquare.classList.add("attacking");
  await delay(2000);
  gridSquare.classList.remove("attacking");
  // Change style of square attacked
  styleSquareAttack(enemyPlayer, coords, attackResult);
  // Wait
  await delay(2000);
  // Turn off gameboard
  enemyGameboard.classList.add("off");
  // Setup next turn
  if (attackResult === "hit") {
    setupTurn(currentPlayer, enemyPlayer);
  } else {
    setupTurn(enemyPlayer, currentPlayer);
  }
  // Some of verify turn will need removed specifically the setup turn and the square styling parts
}

function makeGameboard(container) {
  for (let i = 0; i < 100; i++) {
    const newGridSquare = document.createElement("div");
    newGridSquare.classList.add("grid-square");
    newGridSquare.dataset.index = i;
    container.appendChild(newGridSquare);
  }
}

export function renderGameboards(players) {
  function styleSquare(gameboard, coords, ship, index) {
    const gridSquareIndex = getGridIndex(coords);

    const gridSquares = gameboard.querySelectorAll(".grid-square");
    const gridSquare = gridSquares[gridSquareIndex];

    gridSquare.classList.add("ship");

    let direction = ship.direction;

    if (direction === "single") {
      return;
    }

    if (direction === "up" || direction === "down") {
      gridSquare.classList.add("vertical");
    } else {
      gridSquare.classList.add("horizontal");
    }

    if (index < ship.length - 1) {
      gridSquare.classList.add("middle");
      return;
    }

    switch (direction) {
      case "up":
        if (index === 0) {
          gridSquare.classList.add("bottom");
        } else {
          gridSquare.classList.add("top");
        }
        break;
      case "down":
        if (index === 0) {
          gridSquare.classList.add("top");
        } else {
          gridSquare.classList.add("bottom");
        }
        break;
      case "left":
        if (index === 0) {
          gridSquare.classList.add("right");
        } else {
          gridSquare.classList.add("left");
        }
        break;
      case "right":
        if (index === 0) {
          gridSquare.classList.add("left");
        } else {
          gridSquare.classList.add("right");
        }
        break;
    }
  }

  const gameboards = document.querySelectorAll(".gameboard");

  gameboards.forEach(makeGameboard);

  players.forEach((player, index) => {
    const gameboard = gameboards[index];
    const ships = player.gameboard.ships;
    for (let ship of ships) {
      const coordsArray = ship.coordinatesArray;
      for (const [index, coords] of coordsArray.entries()) {
        styleSquare(gameboard, coords, ship, index);
      }
    }
  });
}

export function getAttackCoordinates(currentPlayer, enemyPlayer) {
  const opponentGameboard = document.getElementById(
    `gameboard-${enemyPlayer.gameboard.boardIndex}`,
  );

  let coordinates;
  const gameboardWidth = 10;

  opponentGameboard.classList.remove("off");
  opponentGameboard.addEventListener("click", function onAttack(e) {
    const gridSquare = e.target;
    const index = gridSquare.dataset.index;
    const yCoordinate = Math.floor(index / gameboardWidth);
    const xCoordinate = index - yCoordinate * gameboardWidth;

    coordinates = [xCoordinate, yCoordinate];

    if (enemyPlayer.gameboard.checkSquareAttacked(coordinates)) {
      alert("This square has already been attacked");
      return;
    }

    this.removeEventListener("click", onAttack);

    verifyTurn(coordinates, currentPlayer, enemyPlayer);
  });
}
