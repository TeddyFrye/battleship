const { Game, Coordinate, Ship, Gameboard, isSunk } = require("./game");
const BOARD_SIZE = 10;

// Initialize DOM elements
const shipContainer = document.getElementById("ship-container");
const humanBoardElement = document.getElementById("humanBoard");
const computerBoardElement = document.getElementById("computerBoard");

// Initialize both boards
renderBoard(humanBoardElement);
renderBoard(computerBoardElement);

function renderBoard(boardElement) {
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = document.createElement("td");
      cell.dataset.x = x;
      cell.dataset.y = y;
      row.appendChild(cell);
    }
    boardElement.appendChild(row);
  }
}

// Handle drag events for human player ship placement
let draggedShip = null;
let isHorizontal = true; // Default orientation

shipContainer.addEventListener("dragstart", (event) => {
  draggedShip = event.target;
  event.dataTransfer.setData("text/plain", draggedShip.id);
});

humanBoardElement.addEventListener("dragover", (event) => {
  event.preventDefault(); // Allow drop
  const cell = event.target;
  if (cell.tagName === "TD") {
    cell.classList.add("drop-target");
  }
});

humanBoardElement.addEventListener("dragleave", (event) => {
  const cell = event.target;
  if (cell.tagName === "TD") {
    cell.classList.remove("drop-target");
  }
});

humanBoardElement.addEventListener("drop", (event) => {
  event.preventDefault();
  const cell = event.target;
  if (cell.tagName === "TD" && draggedShip) {
    const shipSize = parseInt(draggedShip.dataset.size);
    const startX = parseInt(cell.dataset.x);
    const startY = parseInt(cell.dataset.y);

    if (canPlaceShip(startX, startY, shipSize, isHorizontal)) {
      placeShipOnBoard(startX, startY, shipSize, isHorizontal);
      draggedShip.remove(); // Remove ship from the container once placed
    }

    cell.classList.remove("drop-target");
  }
});

function canPlaceShip(startX, startY, size, isHorizontal) {
  for (let i = 0; i < size; i++) {
    const x = isHorizontal ? startX + i : startX;
    const y = isHorizontal ? startY : startY + i;
    if (x >= BOARD_SIZE || y >= BOARD_SIZE) return false; // Ship goes off the board
    const cell = humanBoardElement.querySelector(
      `td[data-x='${x}'][data-y='${y}']`
    );
    if (cell.classList.contains("ship")) return false; // Already occupied
  }
  return true;
}

function placeShipOnBoard(startX, startY, size, isHorizontal) {
  const coordinates = [];
  for (let i = 0; i < size; i++) {
    const x = isHorizontal ? startX + i : startX;
    const y = isHorizontal ? startY : startY + i;
    const cell = humanBoardElement.querySelector(
      `td[data-x='${x}'][data-y='${y}']`
    );
    cell.classList.add("ship"); // Mark cell as occupied
    coordinates.push(Coordinate(x, y));
  }

  // Create a ship object and add it to the gameboard
  const ship = Ship(coordinates[0], coordinates[coordinates.length - 1]);
  if (ship) {
    window.game.humanBoard.placeShip(ship);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    isHorizontal = !isHorizontal; // Toggle orientation on 'r' key press
  }
});

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
      const start = randomCoordinate();
      const isHorizontal = Math.random() < 0.5; // Randomize orientation
      const end = isHorizontal
        ? Coordinate(start.x + size - 1, start.y)
        : Coordinate(start.x, start.y + size - 1);

      // Ensure the end coordinate is within bounds
      if (end.x < BOARD_SIZE && end.y < BOARD_SIZE) {
        const potentialShip = Ship(start, end);
        if (potentialShip) {
          let overlaps = potentialShip.coordinates.some((coordinate) =>
            gameboard.getShipIfOccupied(coordinate)
          );

          if (!overlaps) {
            gameboard.placeShip(potentialShip);
            shipPlaced = true;
          }
        }
      }

      attempts++;
    }

    if (attempts === MAX_ATTEMPTS) {
      console.error(
        "Failed to place ship after max attempts. Resetting board."
      );
      gameboard.reset();
      placeRandomComputerShips(gameboard);
    }
  });
}

function beginGame() {
  // Initialize the game
  if (!window.game) {
    window.game = Game();
  }
  // Place ships on the computer board
  placeRandomComputerShips(window.game.computerBoard);

  // Render both boards
  renderGameboard(window.game.humanBoard, "humanBoard", true);
  renderGameboard(window.game.computerBoard, "computerBoard", false);
}

function renderGameboard(gameboard, boardId, preserveShips = false) {
  const boardElement = document.getElementById(boardId);
  boardElement.innerHTML = ""; // Clear the board's HTML

  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < BOARD_SIZE; x++) {
      const cell = document.createElement("td");
      const coord = Coordinate(x, y);

      if (preserveShips && gameboard.getShipIfOccupied(coord)) {
        cell.classList.add("ship");
      }
      if (ship && ship.isSunk()) {
        cell.classList.add("sunk");
      }
      if (
        gameboard.getShipIfOccupied(coord) &&
        gameboard.getShipIfOccupied(coord).hits.some((hit) => hit.equals(coord))
      ) {
        cell.classList.add("hit");
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

const beginGameButton = document.getElementById("beginGameButton");
beginGameButton.addEventListener("click", beginGame);

computerBoardElement.addEventListener("click", (event) => {
  if (event.target.tagName === "TD") {
    const cell = event.target;
    const rowIndex = Array.from(cell.parentNode.parentNode.children).indexOf(
      cell.parentNode
    );
    const colIndex = Array.from(cell.parentNode.children).indexOf(cell);

    // Handle the attack on the computer's board using rowIndex and colIndex.
    const isWin = window.game.step(colIndex, rowIndex);
    console.log(window.game.humanBoard);
    renderGameboard(window.game.humanBoard, "humanBoard", true);
    renderGameboard(window.game.computerBoard, "computerBoard", false);
    console.log(`Attacking coordinate: (${colIndex}, ${rowIndex})`);

    if (isWin) {
      const winner = window.game.getWinner();
      showVictoryMessage(winner);
    }
  }
});

function showVictoryMessage(winner) {
  const victoryMessage = document.createElement("div");
  victoryMessage.textContent = `${winner} wins!`;
  victoryMessage.classList.add("victory-message");
  document.body.appendChild(victoryMessage);

  setTimeout(() => {
    if (confirm(`${winner} wins! Would you like to play again?`)) {
      window.game.restart();
      renderGameboard(window.game.humanBoard, "humanBoard", true);
      renderGameboard(window.game.computerBoard, "computerBoard", false);
      document.body.removeChild(victoryMessage);
    }
  }, 100);
}

module.exports.renderBoard = renderBoard;
module.exports.beginGame = beginGame;
module.exports.renderGameboard = renderGameboard;
