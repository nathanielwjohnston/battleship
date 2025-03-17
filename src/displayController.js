import { createShip, createGameboard, createPlayer } from "../src/generator";

function makeGameboard(container) {
  for (let i = 0; i < 100; i++) {
    const newGridSquare = document.createElement("div");
    newGridSquare.classList.add("grid-square");
    container.appendChild(newGridSquare);
  }
}

export function renderGameboards(players) {
  console.log(players);

  function colourSquare(gameboard, coords, colour) {
    const gameboardWidth = 10;

    const gridSquareIndex = coords[0] + coords[1] * gameboardWidth;
    console.log(gridSquareIndex);

    const gridSquares = gameboard.querySelectorAll(".grid-square");
    console.log(gridSquares);
    const gridSquare = gridSquares[gridSquareIndex];

    gridSquare.style.backgroundColor = colour;
  }

  const gameboards = document.querySelectorAll(".gameboard");

  gameboards.forEach(makeGameboard);

  players.forEach((player, index) => {
    const gameboard = gameboards[index];
    const ships = player.gameboard.ships;
    for (let ship of ships) {
      const coordsArray = ship.coordinatesArray;
      for (let coords of coordsArray) {
        colourSquare(gameboard, coords, "black");
      }
    }
  });
}
