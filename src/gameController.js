import { createShip, createGameboard, createPlayer } from "../src/generator";
import * as displayController from "../src/displayController";

export function startGame() {
  const shipLengths = [5, 4, 3, 3, 2];

  const players = [];
  let realStatus = true;
  for (let i = 0; i < 2; i++) {
    const player = createPlayer(realStatus);
    // TODO: temporary?
    shipLengths.forEach((length) => {
      player.gameboard.placeShip([], length, true);
    });
    players.push(player);

    realStatus = false;
  }

  // Will need to eventually add a way for user to select ship placement
  return players;
}

export function takeTurn() {}

export function endGame() {}
