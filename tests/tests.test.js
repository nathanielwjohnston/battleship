import { createShip, createGameboard } from "../src";

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
            ["F", 3],
            ["F", 4],
          ],
          2,
        ),
      ).toBe(true);
      expect(gameboard.placeShip([["C", 9]], 1)).toBe(true);
    });
    // These should be rejected by the ui controller anyway, but if the ui is bypassed
    // it("rejects a ship being placed out of bounds", () => {
    //   expect(
    //     gameboard.placeShip(
    //       [
    //         ["K", 3],
    //         ["K", 4],
    //       ],
    //       2,
    //     ),
    //   ).toBe(false);
    //   expect(gameboard.placeShip([["A", 0]], 1)).toBe(false);
    // });
    // it("rejects a ship being placed in another ship's place", () => {
    //   it("can place a ship", () => {
    //     expect(
    //       gameboard.placeShip(
    //         [
    //           ["E", 3],
    //           ["F", 3],
    //         ],
    //         2,
    //       ),
    //     ).toBe(false);
    //     expect(gameboard.placeShip([["C", 9]], 1)).toBe(false);
    // });
    // it("rejects a ship not on adjacent squares");
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
