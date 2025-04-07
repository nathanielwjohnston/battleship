import { setupTurn, verifyTurn } from "./gameController";

function displayMessage(message) {
  const messageBox = document.querySelector(".message-container h1");

  messageBox.textContent = message;
}

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
    displayMessage("Attack Incoming!");
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
  // Wait if computer
  if (
    !currentPlayer.isReal ||
    (currentPlayer.isReal && attackResult === "miss")
  ) {
    await delay(2000);
  }
  // Turn off gameboard
  enemyGameboard.classList.add("off");

  if (enemyPlayer.gameboard.checkRemainingShips() === 0) {
    endGame(currentPlayer);
    return;
  }
  // Setup next turn
  if (attackResult === "hit") {
    setupTurn(currentPlayer, enemyPlayer);
  } else {
    setupTurn(enemyPlayer, currentPlayer);
  }
  // Some of verify turn will need removed specifically the setup turn and the square styling parts
}

function makeGameboard(container) {
  const gameboard = container.querySelector(".gameboard");
  for (let i = 0; i < 100; i++) {
    const newGridSquare = document.createElement("div");
    newGridSquare.classList.add("grid-square");
    newGridSquare.dataset.index = i;
    gameboard.appendChild(newGridSquare);
  }

  function createAxes(axis) {
    let characterCode;
    if (axis.classList.contains("x-axis")) {
      characterCode = 65;
    } else {
      characterCode = 48;
    }
    for (let i = 0; i < 10; i++) {
      const newAxisMarker = document.createElement("div");
      newAxisMarker.classList.add("axis-marker");
      const tag = document.createTextNode(
        `${String.fromCharCode(characterCode)}`,
      );
      characterCode += 1;
      newAxisMarker.appendChild(tag);
      axis.appendChild(newAxisMarker);
    }
  }

  const xAxis = container.querySelector(".x-axis");
  createAxes(xAxis);

  const yAxis = container.querySelector(".y-axis");
  createAxes(yAxis);
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

  function renderBoard(player, gameboard) {
    const ships = player.gameboard.ships;
    for (let ship of ships) {
      const coordsArray = ship.coordinatesArray;
      for (const [index, coords] of coordsArray.entries()) {
        styleSquare(gameboard, coords, ship, index);
      }
    }
  }

  function clearBoard(gameboard) {
    const gridSquares = gameboard.querySelectorAll(".ship");
    for (let gridSquare of gridSquares) {
      // Reset styling on grid squares
      gridSquare.className = "grid-square";
    }
  }

  function pickShips(player) {
    // Highlight board for selection
    const gameboardContainers = document.querySelectorAll(
      ".gameboard-container",
    );
    const gameboardContainer = gameboardContainers[player.gameboard.boardIndex];
    const gameboard = gameboardContainer.querySelector(".gameboard");
    gameboard.classList.remove("off");

    const randomiseButton = document.createElement("button");
    const label = document.createTextNode("Randomise");
    randomiseButton.appendChild(label);
    randomiseButton.classList.add("random-button");

    const shipLengths = [5, 4, 3, 3, 2];

    randomiseButton.addEventListener("click", () => {
      player.gameboard.clearShips();
      shipLengths.forEach((length) => {
        player.gameboard.placeShip([], length, true);
      });
      clearBoard(gameboard);
      renderBoard(player, gameboard);
    });

    const confirmButton = document.createElement("button");
    const confirmLabel = document.createTextNode("Confirm Selection");
    confirmButton.appendChild(confirmLabel);
    confirmButton.classList.add("confirm-button");

    confirmButton.addEventListener("click", () => {
      gameboard.classList.add("off");

      const randomButton = document.querySelector(".random-button");
      const button = document.querySelector(".confirm-button");

      randomButton.remove();

      // Set up game after player chooses their positions
      setupTurn(players[0], players[1]);

      button.remove();
    });

    // Change to be underneath specific gameboard
    gameboardContainer.appendChild(randomiseButton);
    gameboardContainer.appendChild(confirmButton);
  }

  const gameboardContainers = document.querySelectorAll(".gameboard-container");

  gameboardContainers.forEach(makeGameboard);

  const gameboards = document.querySelectorAll(".gameboard");

  players.forEach((player, index) => {
    const gameboard = gameboards[index];
    if (player.isReal) {
      renderBoard(player, gameboard);
      pickShips(player);
    }
  });
}

export function getAttackCoordinates(currentPlayer, enemyPlayer) {
  displayMessage("Your turn");

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

function endGame(winner) {
  let message;
  // Will only work for 1 player
  if (winner.isReal) {
    message = "You won!";
  } else {
    message = "You lost...";
  }

  displayMessage(message);
}
