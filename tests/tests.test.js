import { createShip } from "../src";

describe("ship", () => {
  const ship = createShip(5);

  it("can be hit", () => {
    expect(ship.hit()).toBe(1);
  })
  for (let i=0; i < 4; i++) {
    ship.hit();
  }
  it("isn't always sunk", () => {
    expect(ship.isSunk()).toBe(false);
  })
  for (let i=0; i < 4; i++) {
    ship.hit();
  }
  it("can be sunk", () => {
    expect(ship.isSunk()).toBe(true);
  })
})