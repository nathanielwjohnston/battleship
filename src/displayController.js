import { createShip, createGameboard, createPlayer } from "../src/generator";

function makeGameboard(container) {
  for (let i = 0; i < 100; i++) {
    const newGridSquare = document.createElement("div");
    newGridSquare.classList.add("grid-square");
    container.appendChild(newGridSquare);
  }
}

export function renderGameboards(players) {
  function styleSquare(gameboard, coords, ship, index) {
    const gameboardWidth = 10;

    const gridSquareIndex = coords[0] + coords[1] * gameboardWidth;

    const gridSquares = gameboard.querySelectorAll(".grid-square");
    const gridSquare = gridSquares[gridSquareIndex];

    gridSquare.classList.add("ship");

    let direction = ship.direction;

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
