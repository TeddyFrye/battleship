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

// Tests for Player
const Player = require("./player");

test("Player can attack enemy gameboard", () => {
  const enemyGameboard = Gameboard();
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.getMissedAttacks()).toEqual([{ x: 0, y: 0 }]);
});

test("Computer player can make a unique move", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  computerPlayer.computerMove();
  expect(enemyGameboard.getMissedAttacks().length).toBe(1);
});

test("Player should attack only unique coordinates", () => {
  const enemyGameboard = Gameboard();
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  player.attack(0, 0); // duplicate attack
  expect(enemyGameboard.getMissedAttacks()).toEqual([{ x: 0, y: 0 }]);
});

test("Computer player should always make a unique move", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  const totalCells = 100; // considering a 10x10 gameboard

  // Let computer make moves until all cells are hit
  for (let i = 0; i < totalCells; i++) computerPlayer.computerMove();

  // Another move should not be possible as all cells are hit
  expect(() => computerPlayer.computerMove()).toThrowError(
    "No more unique moves available"
  );
});

test("Player should be able to hit enemy ship", () => {
  const enemyGameboard = Gameboard();
  const ship = Ship(3);
  enemyGameboard.placeShip(ship, 0, 0, "horizontal");
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(ship.isSunk()).toBe(false); // should not be sunk as it's of length 3 and hit once
});

test("Player should be able to sink enemy ship", () => {
  const enemyGameboard = Gameboard();
  const ship = Ship(1); // Ship of length 1
  enemyGameboard.placeShip(ship, 0, 0, "horizontal");
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(ship.isSunk()).toBe(true); // should be sunk as it's of length 1 and hit once
});
