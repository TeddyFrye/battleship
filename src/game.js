const BOARD_SIZE = 10;

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

  const getStatus = () => {
    if (allShipsSunk()) {
      return "lost";
    } else {
      return "playing";
    }
  };

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    ships,
    getMissedAttacks,
    getShipIfOccupied,
    size,
    getStatus,
    reset,
    isValidCoordinate,
  };
}

function Player(name, gameboard, isComputer = false) {
  let moves = [];
  let hitQueue = []; // Queue to store targets adjacent to the last hit
  const reset = () => {
    moves.length = 0;
    hitQueue.length = 0;
  };

  const attack = (target) => {
    logAttack(target);
    gameboard.receiveAttack(target);
    moves.push(target);

    // If a ship is hit, enqueue adjacent coordinates to hitQueue
    const ship = gameboard.getShipIfOccupied(target);
    if (ship && !ship.isSunk()) {
      enqueueAdjacentTargets(target);
    }
  };

  const logAttack = (target) => {
    const { x, y } = target;
    console.log(`${name} attacked ${x}, ${y}`);
  };

  const enqueueAdjacentTargets = (coordinate) => {
    const { x, y } = coordinate;
    const potentialTargets = [
      Coordinate(x + 1, y),
      Coordinate(x - 1, y),
      Coordinate(x, y + 1),
      Coordinate(x, y - 1),
    ];

    potentialTargets.forEach((coord) => {
      if (
        gameboard.isValidCoordinate(coord) &&
        !moves.some((move) => move.equals(coord)) &&
        !hitQueue.some((move) => move.equals(coord))
      ) {
        hitQueue.push(coord);
      }
    });
  };

  const smarterMove = () => {
    let target = null;
    let x, y; // Declare x and y here
    if (hitQueue.length > 0) {
      // If there are targets in hitQueue, target them first
      target = hitQueue.shift();
    } else {
      // Implement a checkerboard pattern
      do {
        x = Math.floor(Math.random() * BOARD_SIZE);
        y = Math.floor(Math.random() * BOARD_SIZE);

        // Checkerboard pattern: only attack cells where (x + y) % 2 == 0
        target = Coordinate(x, y);
      } while (
        (moves.some((move) => move.equals(target)) || (x + y) % 2 !== 0) &&
        hitQueue.length === 0
      );
    }

    attack(target);
  };

  return { name, attack, isComputer, smarterMove, moves, reset };
}

function Game() {
  let humanBoard = Gameboard();
  let computerBoard = Gameboard();
  let human = Player("Human", computerBoard);
  let computer = Player("Computer", humanBoard, true);
  let winner = null;

  const step = (x, y) => {
    const target = Coordinate(x, y);
    human.attack(target);
    let status = computerBoard.getStatus();
    if (status === "lost") {
      console.log("Human wins!");
      winner = "Human";
      return true;
    }

    computer.smarterMove();
    status = humanBoard.getStatus();
    if (status === "lost") {
      console.log("Computer wins!");
      winner = "Computer";
      return true;
    }
    return false;
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
    restart,
    humanBoard,
    computerBoard,
    human,
    computer,
    getWinner,
  };
}

module.exports.Coordinate = Coordinate;
module.exports.Ship = Ship;
module.exports.Gameboard = Gameboard;
module.exports.Player = Player;
module.exports.Game = Game;
