//test for tests to work
const myFunction = require("./script.js"); // Adjust the import to your function or module

test("it should work", () => {
  expect(myFunction()).toBe(true); // Adjust the expectation to your actual function
});

// Tests for Ship
const Ship = require("./ship");

test("should initialize with correct length", () => {
  const ship = Ship(3);
  expect(ship.length).toBe(3);
});

test("should correctly report when it is not sunk", () => {
  const ship = Ship(3);
  expect(ship.isSunk()).toBe(false);
});

test("should correctly report when it is sunk", () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});

test("should be able to get hit", () => {
  const ship = Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

// Tests for Gameboard
const Gameboard = require("./gameboard");

test("Gameboard can place a ship", () => {
  const gameboard = Gameboard(Ship);
  gameboard.placeShip([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]);
  expect(gameboard.allShipsSunk()).toBe(false);
});

test("Gameboard can receive an attack", () => {
  const gameboard = Gameboard(Ship);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.getMissedAttacks()).toEqual([{ x: 0, y: 0 }]);
});

test("Gameboard can report all ships sunk", () => {
  const gameboard = Gameboard(Ship);
  gameboard.placeShip([{ x: 0, y: 0 }]);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.allShipsSunk()).toBe(true);
});
