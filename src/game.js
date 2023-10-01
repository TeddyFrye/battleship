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

  const isValidCoordinate = (x, y) => {
    return x >= 0 && x < size && y >= 0 && y < size;
  };

  const isOccupied = (x, y) => {
    return getShipIfOccupied(x, y) !== false;
  };

  const getShipIfOccupied = (x, y) => {
    const foundShip = ships.find((ship) =>
      ship.coordinates.some((coord) => coord.x === x && coord.y === y)
    );
    return foundShip || false;
  };

  const placeShip = (ship) => {
    let canPlace = true;

    ship.coordinates.forEach(({ x, y }) => {
      if (!isValidPlacement(x, y)) {
        canPlace = false;
      }
    });

    if (canPlace) {
      ships.push(ship);
      return true;
    }

    return false;
  };

  function isValidPlacement(x, y) {
    return isValidCoordinate(x, y) && !isOccupied(x, y);
  }

  const receiveAttack = (x, y) => {
    const coordinate = Coordinate(x, y);
    // Check if this coordinate has already been attacked
    const alreadyAttacked =
      missedAttacks.some((miss) => miss.equals(coordinate)) ||
      ships.some((ship) => ship.hits.some((hit) => hit.equals(coordinate)));

    if (alreadyAttacked) {
      console.log("Already attacked this coordinate!");
      return;
    }

    const ship = getShipIfOccupied(x, y);
    if (ship) {
      ship.hit(coordinate);
      console.log("Hit!");
    } else {
      missedAttacks.push(coordinate);
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
      board[x][y] = "O";
    });

    ships.forEach((ship) => {
      ship.coordinates.forEach(({ x, y }) => {
        board[x][y] = ship.isSunk() ? "🔥" : "🚢";
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

  const attack = (x, y) => {
    logAttack(x, y);
    gameboard.receiveAttack(x, y);
    moves.push({ x, y });
  };

  const logAttack = (x, y) => {
    console.log(`${name} attacked ${x}, ${y}`);
  };

  const computerMove = () => {
    let x, y;

    do {
      x = Math.floor(Math.random() * BOARD_SIZE);
      y = Math.floor(Math.random() * BOARD_SIZE);
    } while (moves.some((move) => move.x === x && move.y === y));
    attack(x, y);
  };

  return { name, attack, isComputer, computerMove, moves };
}

function placeDefaultShips(gameboard) {
  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));
  // gameboard.placeShip([{ x: 1, y: 0 }]);
  // gameboard.placeShip([{ x: 1, y: 2 }]);
}

function placePlayerShips(gameboard) {
  let numberOfShips = 3; // or any number you prefer
  for (let i = 0; i < numberOfShips; i++) {
    let isPlaced = false;
    while (!isPlaced) {
      let x = parseInt(prompt(`Enter the x coordinate for ship ${i + 1}:`));
      let y = parseInt(prompt(`Enter the y coordinate for ship ${i + 1}:`));

      isPlaced = gameboard.placeShip([{ x, y }]);

      if (!isPlaced) {
        alert(`Error placing ship at ${x}, ${y}. Please try again.`);
      }
    }
  }
}

function placeComputerShips(gameboard) {
  const isOccupied = (x, y, ships) => {
    return ships.some((ship) =>
      ship.coordinates.some((coord) => coord.x === x && coord.y === y)
    );
  };

  const isValidCoordinate = (x, y) => {
    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
  };

  let numberOfShips = 3;
  for (let i = 0; i < numberOfShips; i++) {
    let isValid = false;
    while (!isValid) {
      let x = Math.floor(Math.random() * BOARD_SIZE);
      let y = Math.floor(Math.random() * BOARD_SIZE);

      if (!isValidCoordinate(x, y)) {
        console.error("Invalid coordinates! Computer made a mistake.");
      } else if (isOccupied(x, y, gameboard.ships)) {
        console.error(
          "Coordinates are already occupied! Computer made a mistake."
        );
      } else {
        gameboard.placeShip([{ x, y }]);
        isValid = true;
      }
    }
  }
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
  player.attack(x, y);
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
