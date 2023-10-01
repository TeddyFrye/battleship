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

  const printBoard = (label) => {
    console.log(`\n${label}'s board:`);
    let board = Array(size)
      .fill("▪️")
      .map(() => Array(size).fill("🔳"));
    missedAttacks.forEach(({ x, y }) => {
      board[y][x] = "🌊";
    });

    ships.forEach((ship) => {
      ship.coordinates.forEach(({ x, y }) => {
        board[y][x] = ship.isSunk() ? "🔥" : "🚢";
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
    printBoard,
    ships,
    getMissedAttacks,
    size,
    getStatus,
  };
}

function Player(name, gameboard, isComputer = false) {
  const moves = [];

  const attack = (target) => {
    logAttack(target);
    gameboard.receiveAttack(target);
    moves.push(target);
  };

  const logAttack = (target) => {
    const { x, y } = target;
    console.log(`${name} attacked ${x}, ${y}`);
  };

  const computerMove = () => {
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

  return { name, attack, isComputer, computerMove, moves };
}

function placeDefaultShips(gameboard) {
  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));
  // gameboard.placeShip([{ x: 1, y: 0 }]);
  // gameboard.placeShip([{ x: 1, y: 2 }]);
}

const playerBoard = Gameboard();
const computerBoard = Gameboard();
const player = Player("Player", computerBoard);
const computer = Player("Computer", playerBoard, true);

const gameStart = () => {
  placeDefaultShips(playerBoard);
  placeDefaultShips(computerBoard);
  playerBoard.printBoard("👶");
  computerBoard.printBoard("🤖");
};

const gameStep = (x, y) => {
  const target = Coordinate(x, y);
  player.attack(target);
  computerBoard.printBoard("🤖");
  let status = computerBoard.getStatus();
  if (status === "lost") {
    console.log("Player wins!");
    return;
  }

  computer.computerMove();
  playerBoard.printBoard("👶");
  status = playerBoard.getStatus();
  if (status === "lost") {
    console.log("Computer wins!");
    return;
  }
};

// export functions for test.js
module.exports.Coordinate = Coordinate;
module.exports.Ship = Ship;
module.exports.Gameboard = Gameboard;
module.exports.Player = Player;

// exports for console-only version
module.exports.gameStart = gameStart;
module.exports.gameStep = gameStep;
module.exports.playerBoard = playerBoard;
module.exports.computerBoard = computerBoard;
module.exports.player = player;
module.exports.computer = computer;
