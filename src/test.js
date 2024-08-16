const { Coordinate, Ship, Gameboard, Player, Game } = require("./game.js");

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
  gameboard.receiveAttack(Coordinate(0, 0));
  expect(ship.hits.length).toBe(1);
  expect(ship.isSunk()).toBe(true);
});

test("Gameboard can report all ships sunk", () => {
  const gameboard = Gameboard();
  const ship1 = Ship(Coordinate(0, 0), Coordinate(0, 0));
  const ship2 = Ship(Coordinate(1, 1), Coordinate(1, 1));
  gameboard.placeShip(ship1);
  gameboard.placeShip(ship2);
  gameboard.receiveAttack(Coordinate(0, 0));
  gameboard.receiveAttack(Coordinate(1, 1));
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
  const human = Player("human1", enemyGameboard);
  human.attack(Coordinate(0, 0));
  expect(enemyGameboard.getMissedAttacks()[0].equals(Coordinate(0, 0))).toBe(
    true
  );
});

test("Player should be able to hit and sink enemy ship", () => {
  const enemyGameboard = Gameboard();
  ship = Ship(Coordinate(0, 0), Coordinate(0, 0));
  enemyGameboard.placeShip(ship);
  const human = Player("human1", enemyGameboard);
  human.attack(Coordinate(0, 0));
  expect(enemyGameboard.ships[0].hits.length).toBe(1);
  expect(enemyGameboard.ships[0].isSunk()).toBe(true);
  expect(enemyGameboard.allShipsSunk()).toBe(true);
});

// Tests for Game
test("Game initializes with no winner", () => {
  const game = Game();
  expect(game.getWinner()).toBe(null);
});

test("Restart game should reset all game variables", () => {
  const game = Game();
  const enemyGameboard = Gameboard();
  expect(game.getWinner()).toBe(null);
  ship = Ship(Coordinate(0, 0), Coordinate(0, 0));
  enemyGameboard.placeShip(ship);
  game.step(0, 0);
  expect(game.getWinner()).toBe("Human");
  game.restart();
  expect(game.human.moves.length).toBe(0);
  expect(game.humanBoard.ships.length).toBe(0);
  expect(game.computerBoard.ships.length).toBe(0);
  expect(game.computer.moves.length).toBe(0);
});

test("Game state resets correctly after restart", () => {
  const game = Game();
  const enemyGameboard = Gameboard();
  ship = Ship(Coordinate(0, 0), Coordinate(0, 0));
  enemyGameboard.placeShip(ship);
  game.step(0, 0);
  game.restart();
  expect(game.humanBoard.ships.length).toBe(0);
  expect(game.humanBoard.getMissedAttacks().length).toBe(0);
  expect(game.computerBoard.ships.length).toBe(0);
  expect(game.computerBoard.getMissedAttacks().length).toBe(0);
});
