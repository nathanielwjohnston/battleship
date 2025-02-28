import { createShip } from "../src";

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
