import { createShip, createGameboard, createPlayer } from "../src/generator";
import * as displayController from "../src/displayController";

export function startGame() {
  const shipLengths = [5, 4, 3, 3, 2];

  const players = [];
  let realStatus = true;
  for (let i = 0; i < 2; i++) {
    const player = createPlayer(realStatus);
    // TODO: temporary?
    player.gameboard.placeShip([], 5, true);
    player.gameboard.placeShip([], 4, true);
    player.gameboard.placeShip([], 3, true);
    player.gameboard.placeShip([], 3, true);
    player.gameboard.placeShip([], 2, true);
    players.push(player);

    realStatus = false;
  }

  // Will need to eventually add a way for user to select ship placement
  return players;
}

export function takeTurn() {}

export function endGame() {}
