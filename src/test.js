const { Coordinate, Ship, Gameboard, Player } = require("./game.js");

// Tests for Ship
test("should initialize with correct length and no hits", () => {
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2)); // A ship of length 3 along row 0
  expect(ship.coordinates.length).toBe(3);
  expect(ship.hits.length).toBe(0);
});

test("should correctly report when it is not sunk", () => {
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2));
  expect(ship.isSunk()).toBe(false);
});

test("should correctly report hit count", () => {
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2));
  ship.hit(Coordinate(0, 0));
  expect(ship.hits.length).toEqual(1);
});

test("should correctly report when it is sunk", () => {
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2));
  ship.hit(Coordinate(0, 0));
  ship.hit(Coordinate(0, 1));
  ship.hit(Coordinate(0, 2));
  expect(ship.isSunk()).toBe(true);
});

test("should be able to get hit without sinking", () => {
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2));
  ship.hit(Coordinate(0, 0));
  expect(ship.isSunk()).toBe(false);
});

// Tests for Gameboard
test("Gameboard can place a ship", () => {
  const gameboard = Gameboard();
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 2));
  gameboard.placeShip(ship);
  expect(gameboard.allShipsSunk()).toBe(false);
});

test("Gameboard can receive an attack", () => {
  const gameboard = Gameboard();
  gameboard.receiveAttack(0, 0);
  // expect(gameboard.getMissedAttacks()).toEqual([Coordinate(0, 0)]);
});

test("Ship can register hit and sink from gameboard", () => {
  const gameboard = Gameboard();
  const ship = Ship(Coordinate(0, 0), Coordinate(0, 0));
  gameboard.placeShip(ship);
  gameboard.receiveAttack(0, 0);
  expect(ship.hits.length).toBe(1);
  expect(ship.isSunk()).toBe(true);
});

test("Gameboard can report all ships sunk", () => {
  const gameboard = Gameboard();
  const ship1 = Ship(Coordinate(0, 0), Coordinate(0, 0));
  const ship2 = Ship(Coordinate(1, 1), Coordinate(1, 1));
  gameboard.placeShip(ship1);
  gameboard.placeShip(ship2);
  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 1);
  expect(ship1.isSunk()).toBe(true);
  expect(ship2.isSunk()).toBe(true);
  expect(gameboard.allShipsSunk()).toBe(true);
});

// Tests for Player
test("Player.js is connected properly", () => {
  expect(Player()).toBeDefined();
});

test("Player can attack enemy gameboard", () => {
  const enemyGameboard = Gameboard();
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.getMissedAttacks()[0].equals(Coordinate(0, 0))).toBe(
    true
  );
});

test("Computer player can make a unique move", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  computerPlayer.computerMove();
  expect(computerPlayer.moves.length).toBe(1);
});

test("Computer player should be able to fill board", () => {
  const enemyGameboard = Gameboard();
  const computerPlayer = Player("computer", enemyGameboard, true);
  const totalSpaces = enemyGameboard.size * enemyGameboard.size;
  for (let i = 0; i < totalSpaces; i++) computerPlayer.computerMove();
  expect(new Set(computerPlayer.moves.map(JSON.stringify)).size).toBe(
    totalSpaces
  );
});

test("Player should be able to hit and sink enemy ship", () => {
  const enemyGameboard = Gameboard();
  ship = Ship(Coordinate(0, 0), Coordinate(0, 0));
  enemyGameboard.placeShip(ship);
  const player = Player("player1", enemyGameboard);
  player.attack(0, 0);
  expect(enemyGameboard.ships[0].hits.length).toBe(1);
  expect(enemyGameboard.ships[0].isSunk()).toBe(true);
  expect(enemyGameboard.allShipsSunk()).toBe(true);
});
