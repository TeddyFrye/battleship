const { Game, Coordinate, Ship, Gameboard } = require("./game");

// Render the boards
const BOARD_SIZE = 10;

function renderBoard(boardId) {
  console.log("renderBoard function called");
  const boardElement = document.getElementById(boardId);
  for (let i = 0; i < BOARD_SIZE; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement("td");
      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }
  console.log("renderBoard function complete");
}

function randomCoordinate() {
  return Coordinate(
    Math.floor(Math.random() * BOARD_SIZE),
    Math.floor(Math.random() * BOARD_SIZE)
  );
}

function placeRandomComputerShips(gameboard) {
  const sizes = [2, 3, 5];
  const MAX_ATTEMPTS = 100;

  sizes.forEach((size) => {
    let attempts = 0;
    let shipPlaced = false;

    while (!shipPlaced && attempts < MAX_ATTEMPTS) {
      let start = randomCoordinate();
      let end = randomCoordinate();

      if (
        (start.x === end.x || start.y === end.y) &&
        (Math.abs(start.x - end.x) + 1 === size ||
          Math.abs(start.y - end.y) + 1 === size)
      ) {
        const potentialShip = Ship(start, end);
        let overlaps = potentialShip.coordinates.some((coordinate) =>
          gameboard.getShipIfOccupied(coordinate)
        );

        if (!overlaps) {
          gameboard.placeShip(potentialShip);
          shipPlaced = true;
        }
      }

      attempts++;
    }

    if (attempts === MAX_ATTEMPTS) {
      // If maximum attempts reached for any ship size, reset the board and restart the ship placement
      gameboard.reset();
      placeRandomComputerShips(gameboard);
    }
  });
}

function convertCoord(coordString) {
  if (!coordString || coordString.length < 2) return null;

  const letters = "ABCDEFGHIJ"; // For a 10x10 board
  const x = letters.indexOf(coordString[0]);
  const y = parseInt(coordString.slice(1)) - 1;

  if (x === -1 || y < 0 || y >= BOARD_SIZE) return null; // Invalid coordinate

  return Coordinate(x, y);
}

function placeShip() {
  const shipSizes = ["two", "three", "five"];

  // Place ships on the human board
  shipSizes.forEach((size) => {
    const startCoord = document
      .getElementById(`${size}CellStart`)
      .value.toUpperCase();
    const endCoord = document
      .getElementById(`${size}CellEnd`)
      .value.toUpperCase();
    const start = convertCoord(startCoord);
    const end = convertCoord(endCoord);

    const ship = Ship(Coordinate(start.x, start.y), Coordinate(end.x, end.y));
    if (
      ship &&
      ((size === "two" && ship.coordinates.length === 2) ||
        (size === "three" && ship.coordinates.length === 3) ||
        (size === "five" && ship.coordinates.length === 5))
    ) {
      window.game.humanBoard.placeShip(ship);
    } else {
      alert(`Invalid placement for ${size}-cell ship.`);
    }
  });
  console.log(window.game.humanBoard.ships);
  // Now place random ships on the computer board
  placeRandomComputerShips(window.game.computerBoard);

  // Finally, render both gameboards
  renderGameboard(window.game.humanBoard, "humanBoard");
  renderGameboard(window.game.computerBoard, "computerBoard");
}

function renderGameboard(gameboard, boardId) {
  const boardElement = document.getElementById(boardId);
  boardElement.innerHTML = ""; // Clear the previous board state
  // Use your game logic to determine how to display each cell
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = document.createElement("td");
      // Here, determine the state of the cell using gameboard's methods and display accordingly
      const coord = Coordinate(x, y);
      if (gameboard.getShipIfOccupied(coord)) {
        if (
          boardId === "humanBoard" ||
          gameboard.getShipIfOccupied(coord).isSunk()
        ) {
          cell.classList.add("ship");
        }
        // Check if this ship cell has been hit
        if (
          gameboard
            .getShipIfOccupied(coord)
            .hits.some((hit) => hit.equals(coord))
        ) {
          cell.classList.add("hit");
        } else {
          cell.classList.add("ship");
        }
        if (
          gameboard.getShipIfOccupied(coord) &&
          gameboard.getShipIfOccupied(coord).isSunk()
        ) {
          cell.classList.add("sunk");
        }
      } else if (
        gameboard.getMissedAttacks().some((miss) => miss.equals(coord))
      ) {
        cell.classList.add("miss");
      }
      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }
}

const shipButton = document.getElementById("shipButton");
shipButton.addEventListener("click", placeShip);

const computerBoardElement = document.getElementById("computerBoard");
computerBoardElement.addEventListener("click", (event) => {
  if (event.target.tagName === "TD") {
    const cell = event.target;
    const rowIndex = Array.from(cell.parentNode.children).indexOf(cell);
    const colIndex = Array.from(cell.parentNode.parentNode.children).indexOf(
      cell.parentNode
    );

    // Handle the attack on the computer's board using rowIndex and colIndex.
    window.game.step(rowIndex, colIndex);
    console.log(window.game.humanBoard);
    renderGameboard(window.game.humanBoard, "humanBoard");
    renderGameboard(window.game.computerBoard, "computerBoard");
  }
});

// Export the placeShip function for use in the browser
module.exports.renderBoard = renderBoard;
module.exports.placeShip = placeShip;
module.exports.renderGameboard = renderGameboard;
