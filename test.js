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
