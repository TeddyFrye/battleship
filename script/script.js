function Ship(length) {
  let hitCount = 0;

  function hit() {
    if (hitCount < length) hitCount++;
  }

  function isSunk() {
    return hitCount >= length;
  }

  function getHitCount() {
    return hitCount;
  }

  return { length, hit, isSunk, getHitCount };
}

function Gameboard() {
  let ships = [];
  let missedAttacks = [];

  const placeShip = (coordinates) => {
    let ship = Ship(coordinates.length);
    ship.coordinates = coordinates;
    ships.push(ship);
  };

  const receiveAttack = (x, y) => {
    let hit = false;
    ships.forEach((ship) => {
      ship.coordinates.forEach((coord) => {
        if (coord.x === x && coord.y === y) {
          ship.hit();
          hit = true;
        }
      });
    });
    if (!hit) missedAttacks.push({ x, y });
  };

  const getMissedAttacks = () => {
    return missedAttacks;
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  const printBoard = () => {
    let board = Array(10)
      .fill(".")
      .map(() => Array(10).fill("."));
    missedAttacks.forEach(({ x, y }) => {
      board[x][y] = "O";
    });

    ships.forEach((ship) => {
      ship.coordinates.forEach(({ x, y }) => {
        board[x][y] = ship.isSunk() ? "X" : "S";
      });
    });

    console.log(board.map((row) => row.join(" ")).join("\n"));
  };

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    printBoard,
    ships,
    getMissedAttacks,
  };
}

function Player(name, gameboard, isComputer = false) {
  const moves = [];

  const attack = (x, y) => {
    if (isMoveValid(x, y)) {
      gameboard.receiveAttack(x, y);
      moves.push({ x, y });
    }
  };

  const isMoveValid = (x, y) => {
    return !moves.some((move) => move.x === x && move.y === y);
  };

  const computerMove = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (!isMoveValid(x, y));
    attack(x, y);
  };

  return { name, attack, isComputer, computerMove, moves };
}

const playerBoard = Gameboard();
const computerBoard = Gameboard();
const player = Player("Player", computerBoard);
const computer = Player("Computer", playerBoard, true);

// Example of ship placement
playerBoard.placeShip([{ x: 0, y: 0 }]);
computerBoard.placeShip([{ x: 0, y: 0 }]);

const gameLoop = () => {
  playerBoard.printBoard();
  // Example moves
  player.attack(0, 0);
  computer.computerMove();
  console.log("Player Moves:", player.moves);
  console.log("Computer Moves:", computer.moves);
};

gameLoop();

//export gameloop function
module.exports.gameLoop = gameLoop;
module.exports.Ship = Ship;
module.exports.Gameboard = Gameboard;
module.exports.Player = Player;
