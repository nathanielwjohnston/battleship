import { createShip, createGameboard, createPlayer } from "../src/generator";
import { startGame, takeTurn, endGame } from "../src/gameController";

describe("ship", () => {
  const ship = createShip(5);

  it("can be hit", () => {
    expect(ship.hit()).toBe(1);
  });
  it("isn't always sunk", () => {
    expect(ship.isSunk()).toBe(false);
  });
  it("can be sunk", () => {
    for (let i = 0; i < 4; i++) {
      ship.hit();
    }
    expect(ship.isSunk()).toBe(true);
  });
});

describe("gameboard", () => {
  describe("ship placement", () => {
    const gameboard = createGameboard();
    it("can place a ship", () => {
      expect(
        gameboard.placeShip(
          [
            [5, 3],
            [5, 4],
          ],
          2,
        ),
      ).toBe(true);
      expect(gameboard.placeShip([[2, 9]], 1)).toBe(true);
    });
    // These should be rejected by the ui controller anyway, but if the ui is bypassed
    it("rejects a ship being placed out of bounds", () => {
      expect(
        gameboard.placeShip(
          [
            [10, 3],
            [10, 4],
          ],
          2,
        ),
      ).toBe(false);
      expect(gameboard.placeShip([[0, 10]], 1)).toBe(false);
    });
    it("rejects a ship being placed in another ship's place", () => {
      expect(
        gameboard.placeShip(
          [
            [4, 3],
            [5, 3],
          ],
          2,
        ),
      ).toBe(false);
      expect(gameboard.placeShip([[2, 9]], 1)).toBe(false);
    });
    // it("rejects a ship not on adjacent squares", () => {
    //   expect(
    //     gameboard.placeShip(
    //       [
    //         [4, 3],
    //         [6, 3],
    //       ],
    //       2,
    //     ),
    //   ).toBe(false);
    // });
  });

  describe("receiving an attack", () => {
    const gameboard = createGameboard();
    gameboard.placeShip(
      [
        ["A", 1],
        ["A", 2],
        ["A", 3],
      ],
      3,
    );

    it("should register a miss", () => {
      const coordinates = ["H", 3];
      expect(gameboard.receiveAttack(coordinates)).toBe(false);
      expect(gameboard.misses).toContain(coordinates);
    });

    it("should register a hit", () => {
      const coordinates = ["A", 2];
      expect(gameboard.receiveAttack(coordinates)).toBe(true);
      expect(gameboard.hits).toContain(coordinates);
    });
  });

  describe("checking remaining ships", () => {
    const gameboard = createGameboard();
    beforeAll(() => {
      gameboard.placeShip(
        [
          ["A", 1],
          ["A", 2],
          ["A", 3],
        ],
        3,
      );
      gameboard.placeShip(
        [
          ["C", 1],
          ["C", 2],
          ["C", 3],
        ],
        3,
      );
      gameboard.placeShip(
        [
          ["E", 1],
          ["E", 2],
          ["E", 3],
        ],
        3,
      );
    });

    it("should identify remaining ships", () => {
      expect(gameboard.checkRemainingShips()).toBe(3);
    });

    it("should react to ships being sunk", () => {
      gameboard.receiveAttack(["A", 1]);
      gameboard.receiveAttack(["A", 2]);
      gameboard.receiveAttack(["A", 3]);

      expect(gameboard.checkRemainingShips()).toBe(2);
    });
  });
});

describe("player", () => {
  it("should be real or a computer", () => {
    const player1 = createPlayer(true);
    expect(player1.isReal).toBe(true);

    const player2 = createPlayer(false);
    expect(player2.isReal).toBe(false);
  });

  // it("should have a gameboard", () => {
  //   const player = createPlayer(true);
  //   expect(player.gameboard).toBeInstanceOf();
  // });
});

describe("game controller", () => {
  describe("game start", () => {
    it("should create players", () => {
      const players = startGame();
      for (let player of players) {
        expect(player).toHaveProperty("isReal");

        expect(player).toHaveProperty("gameboard");
        expect(player.gameboard.ships).toHaveLength(5);
        for (let ship of player.gameboard.ships) {
          for (let coords of ship.coordinatesArray) {
            expect(Number.isInteger(coords[0])).toBe(true);
            expect(Number.isInteger(coords[1])).toBe(true);
          }
        }
      }
    });
  });

  describe("taking turns", () => {});

  describe("game end", () => {});
});
