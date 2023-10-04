const BOARD_SIZE = 3;

function Coordinate(x, y) {
  function sameRow(other) {
    return y === other.y;
  }

  function sameColumn(other) {
    return x === other.x;
  }

  function equals(other) {
    return sameRow(other) && sameColumn(other);
  }

  return { x, y, sameRow, sameColumn, equals };
}

function Ship(start, end) {
  if (!start || !end) {
    console.error("Invalid coordinates for Ship.");
    return null;
  }

  if (!start.sameRow(end) && !start.sameColumn(end)) {
    console.error(
      "Invalid ship placement: Start and End coordinates are neither in the same row nor column."
    );
    return null;
  }

  const coordinates = [];

  function makeCoords(start, end) {
    const minX = Math.min(start.x, end.x);
    const maxX = Math.max(start.x, end.x);
    const minY = Math.min(start.y, end.y);
    const maxY = Math.max(start.y, end.y);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        coordinates.push(Coordinate(x, y));
      }
    }
  }

  makeCoords(start, end);

  const length = coordinates.length;
  const hits = [];

  function hit(coordinate) {
    // Check if the coordinate is part of the ship and hasn't been hit yet
    const target = coordinates.find((coord) => coord.equals(coordinate));
    const alreadyHit = hits.some((hit) => hit.equals(coordinate));

    if (target && !alreadyHit) {
      hits.push(target);
    }
  }

  function isSunk() {
    return hits.length >= length;
  }

  return { coordinates, hit, hits, isSunk };
}

function Gameboard() {
  const size = BOARD_SIZE;
  let ships = [];
  let missedAttacks = [];
  const reset = () => {
    ships.length = 0;
    missedAttacks.length = 0;
  };

  const isValidCoordinate = (coordinate) => {
    const { x, y } = coordinate;
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  const isOccupied = (coordinate) => {
    return getShipIfOccupied(coordinate) !== false;
  };

  const getShipIfOccupied = (coordinate) => {
    const foundShip = ships.find((ship) =>
      ship.coordinates.some((shipCoordinate) =>
        shipCoordinate.equals(coordinate)
      )
    );
    return foundShip || false;
  };

  const placeShip = (ship) => {
    let canPlace = true;

    ship.coordinates.forEach((coordinate) => {
      if (!isValidPlacement(coordinate)) {
        canPlace = false;
      }
    });

    if (canPlace) {
      ships.push(ship);
      return true;
    }

    return false;
  };

  function isValidPlacement(target) {
    return isValidCoordinate(target) && !isOccupied(target);
  }

  const receiveAttack = (target) => {
    // Check if this coordinate has already been attacked
    const alreadyAttacked =
      missedAttacks.some((miss) => miss.equals(target)) ||
      ships.some((ship) => ship.hits.some((hit) => hit.equals(target)));

    if (alreadyAttacked) {
      console.log("Already attacked this coordinate!");
      return;
    }

    const ship = getShipIfOccupied(target);
    if (ship) {
      ship.hit(target);
      console.log("Hit!");
    } else {
      missedAttacks.push(target);
      console.log("Missed!");
    }
  };

  const getMissedAttacks = () => {
    return missedAttacks;
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  const print = (label, withShips) => {
    if (withShips === undefined) {
      withShips = true;
    }
    console.log(`\n${label}'s board:`);
    let board = Array(size)
      .fill("▪️")
      .map(() => Array(size).fill("🔳"));
    missedAttacks.forEach(({ x, y }) => {
      board[y][x] = "🌊";
    });

    shipCharacter = withShips ? "🚢" : "🔳";

    ships.forEach((ship) => {
      ship.coordinates.forEach(({ x, y }) => {
        board[y][x] = ship.isSunk() ? "🔥" : shipCharacter;
      });
    });

    console.log(board.map((row) => row.join(" ")).join("\n"));
  };

  const getStatus = () => {
    // return lost if the player with this board has lost
    if (allShipsSunk()) {
      return "lost";
    }
    return "playing";
  };

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    print,
    ships,
    getMissedAttacks,
    size,
    getStatus,
    reset,
  };
}

function Player(name, gameboard, isComputer = false) {
  let moves = [];
  const reset = () => {
    moves.length = 0;
  };

  const attack = (target) => {
    logAttack(target);
    gameboard.receiveAttack(target);
    moves.push(target);
  };

  const logAttack = (target) => {
    const { x, y } = target;
    console.log(`${name} attacked ${x}, ${y}`);
  };

  const randomMove = () => {
    let x, y;
    let attempts = 0;
    const maxAttempts = 100_000;

    do {
      attempts++;
      x = Math.floor(Math.random() * BOARD_SIZE);
      y = Math.floor(Math.random() * BOARD_SIZE);
      target = Coordinate(x, y);
    } while (
      moves.some((move) => move.equals(target)) &&
      attempts < maxAttempts
    );

    attack(target);
  };

  return { name, attack, isComputer, randomMove, moves, reset };
}

function placeDefaultShips(gameboard) {
  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));
  // gameboard.placeShip([{ x: 1, y: 0 }]);
  // gameboard.placeShip([{ x: 1, y: 2 }]);
}

function Game() {
  let humanBoard = Gameboard();
  let computerBoard = Gameboard();
  let human = Player("Human", computerBoard);
  let computer = Player("Computer", humanBoard, true);
  let winner = null;

  const placeDefault = () => {
    placeDefaultShips(humanBoard);
    placeDefaultShips(computerBoard);
    humanBoard.print("👶");
    computerBoard.print("🤖");
  };

  const step = (x, y) => {
    const target = Coordinate(x, y);
    human.attack(target);
    computerBoard.print("🤖");
    let status = computerBoard.getStatus();
    if (status === "lost") {
      console.log("Human wins!");
      winner = "Human";
      console.log(winner);
      return;
    }

    computer.randomMove();
    humanBoard.print("👶");
    status = humanBoard.getStatus();
    if (status === "lost") {
      console.log("Computer wins!");
      winner = "Computer";
      return;
    }
  };

  const restart = () => {
    humanBoard.reset();
    computerBoard.reset();
    human.reset();
    computer.reset();
    winner = null;
  };

  const getWinner = () => {
    console.log(winner);
    return winner;
  };

  return {
    step,
    placeDefault,
    restart,
    humanBoard,
    computerBoard,
    human,
    computer,
    getWinner,
  };
}

// Test functions
function testGameWinner() {
  const game = Game();

  // 1. Initialize a game
  game.placeDefault();

  // 2. Check the winner is null
  if (game.getWinner() !== null) {
    console.error("Failed: Winner should be null after initialization");
    return;
  }

  // Make moves to ensure Human wins
  // Given the default ship placements, I'll assume the Computer's ship is at (0, 0).
  game.step(0, 0);

  // 3. Check that winner is Human
  if (game.getWinner() !== "Human") {
    console.error(
      "Failed: Winner should be Human after sinking Computer's ship"
    );
    return;
  }

  // 4. Restart the game
  game.restart();

  // 5. Check that the board is empty
  if (
    game.humanBoard.ships.length !== 0 ||
    game.humanBoard.getMissedAttacks().length !== 0 ||
    game.computerBoard.ships.length !== 0 ||
    game.computerBoard.getMissedAttacks().length !== 0
  ) {
    console.error("Failed: Boards should be empty after restart");
    return;
  }

  console.log("Test passed successfully!");
}

testGameWinner();

// export functions for test.js
module.exports.Coordinate = Coordinate;
module.exports.Ship = Ship;
module.exports.Gameboard = Gameboard;
module.exports.Player = Player;
module.exports.Game = Game;
