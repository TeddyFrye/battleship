function Ship(length) {
  let hitCount = 0;

  function hit() {
    if (hitCount < length) hitCount++;
    console.log("Direct hit! Coordinates: ({x}, {y})");
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
          console.log("Hit!");
        }
      });
    });
    if (!hit) missedAttacks.push({ x, y });
    console.log("Missed!");
  };

  const getMissedAttacks = () => {
    return missedAttacks;
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
    console.log("All ships sunk!");
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
    gameboard.receiveAttack(x, y);
    moves.push({ x, y });
    console.log(`${name} attacked ${x}, ${y}.`);
  };

  const computerMove = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (moves.some((move) => move.x === x && move.y === y));
    attack(x, y);
    console.log(`The Computer attacked ${x}, ${y}.`);
  };

  return { name, attack, isComputer, computerMove, moves };
}

function placePlayerShips(gameboard) {
  let numberOfShips = 3; // or any number you prefer
  for (let i = 0; i < numberOfShips; i++) {
    let x = prompt(`Enter the x coordinate for ship ${i + 1}:`);
    let y = prompt(`Enter the y coordinate for ship ${i + 1}:`);

    // You may want to add some validation here to ensure the coordinates are valid and not already occupied
    gameboard.placeShip([{ x: parseInt(x), y: parseInt(y) }]);
  }
}

const playerBoard = Gameboard();
const computerBoard = Gameboard();
const player = Player("Player", computerBoard);
const computer = Player("Computer", playerBoard, true);

// Example of ship placement
playerBoard.placeShip([{ x: 0, y: 0 }]);
computerBoard.placeShip([{ x: 0, y: 0 }]);

const gameLoop = () => {
  placePlayerShips(playerBoard);
  let gameOn = true;
  let rounds = 0;
  const maxRounds = 30;
  while (gameOn) {
    if (rounds >= maxRounds) {
      console.log("Game Over! Too many rounds!");
    }
    playerBoard.printBoard();
    computerBoard.printBoard();

    let x = prompt("Enter the x coordinate:");
    let y = prompt("Enter the y coordinate:");

    x = parseInt(x);
    y = parseInt(y);

    player.attack(x, y);
    computer.computerMove();
    rounds++;

    if (playerBoard.allShipsSunk() || computerBoard.allShipsSunk()) {
      gameOn = false;
      alert("Game Over!");
    }
  }
};

// export functions for test.js
exports.gameLoop = gameLoop;
module.exports.gameLoop = gameLoop;
module.exports.Ship = Ship;
module.exports.Gameboard = Gameboard;
module.exports.Player = Player;
