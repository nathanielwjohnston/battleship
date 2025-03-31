import { createPlayer } from "../src/generator";
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

export function setupTurn(currentPlayer, enemyPlayer) {
  function getRandomAttackCoordinates() {
    let validAttack = false;
    const gameboardWidth = 10;
    let coordinates;

    while (!validAttack) {
      coordinates = [
        Math.floor(Math.random() * (gameboardWidth - 1)),
        Math.floor(Math.random() * (gameboardWidth - 1)),
      ];

      validAttack = !enemyPlayer.gameboard.checkSquareAttacked(coordinates);
    }

    return coordinates;
  }

  if (currentPlayer.isReal) {
    displayController.getAttackCoordinates(currentPlayer, enemyPlayer);
  } else {
    // call function to select random coordinates
    const attackCoordinates = getRandomAttackCoordinates();
    verifyTurn(attackCoordinates, currentPlayer, enemyPlayer);
  }
}

export function verifyTurn(coordinates, currentPlayer, enemyPlayer) {
  const enemyGameboard = enemyPlayer.gameboard;
  const hitSuccess = enemyGameboard.receiveAttack(coordinates);
  let attackResult;
  if (hitSuccess) {
    attackResult = "hit";
  } else {
    attackResult = "miss";
  }

  displayController.attackSequence(
    currentPlayer,
    enemyPlayer,
    coordinates,
    attackResult,
  );
}
