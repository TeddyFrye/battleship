const { Ship, Gameboard, Player } = require("./game.js");

// Tests for Ship
// Test to check whether ship.js is connected properly
test("should initialize with correct length", () => {
  const ship = Ship(3);
  expect(ship.length).toBe(3);
});

// Test to check whether ship is sunk
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

test("should be able to get hit without sinking", () => {
  const ship = Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

// Tests for Gameboard
test("Gameboard can place a ship", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ]);
  expect(gameboard.allShipsSunk()).toBe(false);
});

test("Gameboard can receive an attack", () => {
  const gameboard = Gameboard();
  gameboard.receiveAttack(0, 0);
  expect(gameboard.getMissedAttacks()).toEqual([{ x: 0, y: 0 }]);
});

test("Gameboard can report all ships sunk", () => {
  const gameboard = Gameboard();
  gameboard.placeShip([{ x: 0, y: 0 }]);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.allShipsSunk()).toBe(true);
});

// Tests for Player
// Test to check whether player.js is connected properly
test("Player.js is connected properly", () => {
  expect(Player()).toBeDefined();
});

// Test to check whether Player can attack the enemy Gameboard.
test("Player can attack enemy gameboard", () => {
  const enemyGameboard = Gameboard();
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.getMissedAttacks()).toEqual([{ x: 0, y: 0 }]);
});

// Test to ensure computer player can make a unique move.
test("Computer player can make a unique move", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  computerPlayer.computerMove();
  expect(computerPlayer.moves.length).toBe(1);
});

// Test to ensure computer player always makes a unique move.
test("Computer player should always make a unique move", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  for (let i = 0; i < 100; i++) computerPlayer.computerMove();
  expect(new Set(computerPlayer.moves.map(JSON.stringify)).size).toBe(100);
});

// Test to ensure that a Player can hit an enemy ship.
test("Player should be able to hit enemy ship", () => {
  const enemyGameboard = Gameboard();
  const shipCoordinates = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ];
  enemyGameboard.placeShip(shipCoordinates);
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.ships[0].isSunk()).toBe(false);
});

// Test to validate that Player can sink an enemy ship.
test("Player should be able to sink enemy ship", () => {
  const enemyGameboard = Gameboard();
  const shipCoordinates = [{ x: 0, y: 0 }];
  enemyGameboard.placeShip(shipCoordinates);
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.ships[0].isSunk()).toBe(true);
});