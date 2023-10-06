/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Coordinate: () => (/* binding */ Coordinate),\n/* harmony export */   Game: () => (/* binding */ Game),\n/* harmony export */   Gameboard: () => (/* binding */ Gameboard),\n/* harmony export */   Ship: () => (/* binding */ Ship)\n/* harmony export */ });\nconst BOARD_SIZE = 10;\n\nfunction Coordinate(x, y) {\n  function sameRow(other) {\n    return y === other.y;\n  }\n\n  function sameColumn(other) {\n    return x === other.x;\n  }\n\n  function equals(other) {\n    return sameRow(other) && sameColumn(other);\n  }\n\n  return { x, y, sameRow, sameColumn, equals };\n}\n\nfunction Ship(start, end) {\n  if (!start || !end) {\n    console.error(\"Invalid coordinates for Ship.\");\n    return null;\n  }\n\n  if (!start.sameRow(end) && !start.sameColumn(end)) {\n    console.error(\n      \"Invalid ship placement: Start and End coordinates are neither in the same row nor column.\"\n    );\n    return null;\n  }\n\n  const coordinates = [];\n\n  function makeCoords(start, end) {\n    const minX = Math.min(start.x, end.x);\n    const maxX = Math.max(start.x, end.x);\n    const minY = Math.min(start.y, end.y);\n    const maxY = Math.max(start.y, end.y);\n\n    for (let x = minX; x <= maxX; x++) {\n      for (let y = minY; y <= maxY; y++) {\n        coordinates.push(Coordinate(x, y));\n      }\n    }\n  }\n\n  makeCoords(start, end);\n\n  const length = coordinates.length;\n  const hits = [];\n\n  function hit(coordinate) {\n    // Check if the coordinate is part of the ship and hasn't been hit yet\n    const target = coordinates.find((coord) => coord.equals(coordinate));\n    const alreadyHit = hits.some((hit) => hit.equals(coordinate));\n\n    if (target && !alreadyHit) {\n      hits.push(target);\n    }\n  }\n\n  function isSunk() {\n    return hits.length >= length;\n  }\n\n  return { coordinates, hit, hits, isSunk };\n}\n\nfunction Gameboard() {\n  const size = BOARD_SIZE;\n  let ships = [];\n  let missedAttacks = [];\n  const reset = () => {\n    ships.length = 0;\n    missedAttacks.length = 0;\n  };\n\n  const isValidCoordinate = (coordinate) => {\n    const { x, y } = coordinate;\n    return x >= 0 && x < size && y >= 0 && y < size;\n  };\n\n  const isOccupied = (coordinate) => {\n    return getShipIfOccupied(coordinate) !== false;\n  };\n\n  const getShipIfOccupied = (coordinate) => {\n    const foundShip = ships.find((ship) =>\n      ship.coordinates.some((shipCoordinate) =>\n        shipCoordinate.equals(coordinate)\n      )\n    );\n    return foundShip || false;\n  };\n\n  const placeShip = (ship) => {\n    let canPlace = true;\n\n    ship.coordinates.forEach((coordinate) => {\n      if (!isValidPlacement(coordinate)) {\n        canPlace = false;\n      }\n    });\n\n    if (canPlace) {\n      ships.push(ship);\n      return true;\n    }\n\n    return false;\n  };\n\n  function isValidPlacement(target) {\n    return isValidCoordinate(target) && !isOccupied(target);\n  }\n\n  const receiveAttack = (target) => {\n    // Check if this coordinate has already been attacked\n    const alreadyAttacked =\n      missedAttacks.some((miss) => miss.equals(target)) ||\n      ships.some((ship) => ship.hits.some((hit) => hit.equals(target)));\n\n    if (alreadyAttacked) {\n      console.log(\"Already attacked this coordinate!\");\n      return;\n    }\n\n    const ship = getShipIfOccupied(target);\n    if (ship) {\n      ship.hit(target);\n      console.log(\"Hit!\");\n    } else {\n      missedAttacks.push(target);\n      console.log(\"Missed!\");\n    }\n  };\n\n  const getMissedAttacks = () => {\n    return missedAttacks;\n  };\n\n  const allShipsSunk = () => {\n    return ships.every((ship) => ship.isSunk());\n  };\n\n  const getStatus = () => {\n    // return lost if the player with this board has lost\n    if (allShipsSunk()) {\n      return \"lost\";\n    }\n    return \"playing\";\n  };\n\n  return {\n    placeShip,\n    receiveAttack,\n    allShipsSunk,\n    ships,\n    getMissedAttacks,\n    getShipIfOccupied,\n    size,\n    getStatus,\n    reset,\n  };\n}\n\nfunction Player(name, gameboard, isComputer = false) {\n  let moves = [];\n  const reset = () => {\n    moves.length = 0;\n  };\n\n  const attack = (target) => {\n    logAttack(target);\n    gameboard.receiveAttack(target);\n    moves.push(target);\n  };\n\n  const logAttack = (target) => {\n    const { x, y } = target;\n    console.log(`${name} attacked ${x}, ${y}`);\n  };\n\n  const randomMove = () => {\n    let x, y;\n    let attempts = 0;\n    const maxAttempts = 100_000;\n\n    do {\n      attempts++;\n      x = Math.floor(Math.random() * BOARD_SIZE);\n      y = Math.floor(Math.random() * BOARD_SIZE);\n      target = Coordinate(x, y);\n    } while (\n      moves.some((move) => move.equals(target)) &&\n      attempts < maxAttempts\n    );\n\n    attack(target);\n  };\n\n  return { name, attack, isComputer, randomMove, moves, reset };\n}\n\nfunction Game() {\n  let humanBoard = Gameboard();\n  let computerBoard = Gameboard();\n  let human = Player(\"Human\", computerBoard);\n  let computer = Player(\"Computer\", humanBoard, true);\n  let winner = null;\n\n  const placeDefault = () => {\n    placeDefaultShips(humanBoard);\n    placeDefaultShips(computerBoard);\n    humanBoard.print(\"👶\");\n    computerBoard.print(\"🤖\");\n  };\n\n  const step = (x, y) => {\n    const target = Coordinate(x, y);\n    human.attack(target);\n    computerBoard.print(\"🤖\");\n    let status = computerBoard.getStatus();\n    if (status === \"lost\") {\n      console.log(\"Human wins!\");\n      winner = \"Human\";\n      console.log(winner);\n      return;\n    }\n\n    computer.randomMove();\n    humanBoard.print(\"👶\");\n    status = humanBoard.getStatus();\n    if (status === \"lost\") {\n      console.log(\"Computer wins!\");\n      winner = \"Computer\";\n      return;\n    }\n  };\n\n  const restart = () => {\n    humanBoard.reset();\n    computerBoard.reset();\n    human.reset();\n    computer.reset();\n    winner = null;\n  };\n\n  const getWinner = () => {\n    console.log(winner);\n    return winner;\n  };\n\n  return {\n    step,\n    placeDefault,\n    restart,\n    humanBoard,\n    computerBoard,\n    human,\n    computer,\n    getWinner,\n  };\n}\n/*\nfunction placeDefaultShips(gameboard) {\n  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));\n  // gameboard.placeShip([{ x: 1, y: 0 }]);\n  // gameboard.placeShip([{ x: 1, y: 2 }]);\n}\n*/\nfunction showWinnerandPromptRestart(winner) {\n  alert(`${winner} wins! Would you like to play again?`);\n  if (confirm(\"Would you like to play again?\")) {\n    game.restart();\n  }\n}\n\n\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   placeShip: () => (/* binding */ placeShip),\n/* harmony export */   renderBoard: () => (/* binding */ renderBoard),\n/* harmony export */   renderGameboard: () => (/* binding */ renderGameboard)\n/* harmony export */ });\n/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game.js */ \"./src/game.js\");\n\n// Render the boards\nconst BOARD_SIZE = 10;\n\nfunction renderBoard(boardId) {\n  console.log(\"renderBoard function called\");\n  const boardElement = document.getElementById(boardId);\n  for (let i = 0; i < BOARD_SIZE; i++) {\n    const row = document.createElement(\"tr\");\n    for (let j = 0; j < BOARD_SIZE; j++) {\n      const cell = document.createElement(\"td\");\n      row.appendChild(cell);\n    }\n    boardElement.appendChild(row);\n  }\n  console.log(\"renderBoard function complete\");\n}\n\nfunction randomCoordinate() {\n  return (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Coordinate)(\n    Math.floor(Math.random() * BOARD_SIZE),\n    Math.floor(Math.random() * BOARD_SIZE)\n  );\n}\n\nfunction placeRandomComputerShips(gameboard) {\n  const sizes = [2, 3, 5];\n  sizes.forEach((size) => {\n    let start = randomCoordinate();\n    let end = randomCoordinate();\n\n    do {\n      start = randomCoordinate();\n      end = randomCoordinate();\n    } while (\n      !(start.x === end.x || start.y === end.y) ||\n      (Math.abs(start.x - end.x) + 1 !== size &&\n        Math.abs(start.y - end.y) + 1 !== size)\n    );\n\n    const ship = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Ship)(start, end);\n    gameboard.placeShip(ship);\n  });\n}\n\nfunction convertCoord(coordString) {\n  if (!coordString || coordString.length < 2) return null;\n\n  const letters = \"ABCDEFGHIJ\"; // For a 10x10 board\n  const x = letters.indexOf(coordString[0]);\n  const y = parseInt(coordString.slice(1)) - 1;\n\n  if (x === -1 || y < 0 || y >= BOARD_SIZE) return null; // Invalid coordinate\n\n  return (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Coordinate)(x, y);\n}\n\nfunction placeShip() {\n  const shipSizes = [\"two\", \"three\", \"five\"];\n\n  // Place ships on the human board\n  shipSizes.forEach((size) => {\n    const startCoord = document\n      .getElementById(`${size}CellStart`)\n      .value.toUpperCase();\n    const endCoord = document\n      .getElementById(`${size}CellEnd`)\n      .value.toUpperCase();\n    const start = convertCoord(startCoord);\n    const end = convertCoord(endCoord);\n\n    const ship = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Ship)((0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Coordinate)(start.x, start.y), (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Coordinate)(end.x, end.y));\n    if (\n      ship &&\n      ((size === \"two\" && ship.coordinates.length === 2) ||\n        (size === \"three\" && ship.coordinates.length === 3) ||\n        (size === \"five\" && ship.coordinates.length === 5))\n    ) {\n      window.game.humanBoard.placeShip(ship);\n    } else {\n      alert(`Invalid placement for ${size}-cell ship.`);\n    }\n  });\n\n  // Now place random ships on the computer board\n  placeRandomComputerShips(window.game.computerBoard);\n\n  // Finally, render both gameboards\n  renderGameboard(window.game.humanBoard, \"humanBoard\");\n  renderGameboard(window.game.computerBoard, \"computerBoard\");\n}\n\nfunction renderGameboard(gameboard, boardId) {\n  const boardElement = document.getElementById(boardId);\n  boardElement.innerHTML = \"\"; // Clear the previous board state\n  // Use your game logic to determine how to display each cell\n  for (let y = 0; y < BOARD_SIZE; y++) {\n    const row = document.createElement(\"tr\");\n    for (let x = 0; x < BOARD_SIZE; x++) {\n      const cell = document.createElement(\"td\");\n      // Here, determine the state of the cell using gameboard's methods and display accordingly\n      const coord = (0,_game_js__WEBPACK_IMPORTED_MODULE_0__.Coordinate)(x, y);\n      if (gameboard.getShipIfOccupied(coord)) {\n        // Check if this ship cell has been hit\n        if (\n          gameboard\n            .getShipIfOccupied(coord)\n            .hits.some((hit) => hit.equals(coord))\n        ) {\n          cell.classList.add(\"hit\");\n        } else {\n          cell.classList.add(\"ship\");\n        }\n        if (\n          gameboard.getShipIfOccupied(coord) &&\n          gameboard.getShipIfOccupied(coord).isSunk()\n        ) {\n          cell.classList.add(\"sunk\");\n        }\n      } else if (\n        gameboard.getMissedAttacks().some((miss) => miss.equals(coord))\n      ) {\n        cell.classList.add(\"miss\");\n      }\n      row.appendChild(cell);\n    }\n    boardElement.appendChild(row);\n  }\n}\n\nconst shipButton = document.getElementById(\"shipButton\");\nshipButton.addEventListener(\"click\", placeShip);\n\nconst computerBoardElement = document.getElementById(\"computerBoard\");\ncomputerBoardElement.addEventListener(\"click\", (event) => {\n  if (event.target.tagName === \"TD\") {\n    const cell = event.target;\n    const rowIndex = Array.from(cell.parentNode.children).indexOf(cell);\n    const colIndex = Array.from(cell.parentNode.parentNode.children).indexOf(\n      cell.parentNode\n    );\n\n    // Handle the attack on the computer's board using rowIndex and colIndex.\n    window.game.step(rowIndex, colIndex);\n    console.log(window.game.humanBoard);\n    renderGameboard(window.game.humanBoard, \"humanBoard\");\n    renderGameboard(window.game.computerBoard, \"computerBoard\");\n  }\n});\n\nconsole.log(\"Attempting to render the board directly from render.js\");\nrenderBoard(\"humanBoard\");\n\n// Export the placeShip function for use in the browser\n\n\n\n//# sourceURL=webpack:///./src/render.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ \"./src/render.js\");\n\n\nconsole.log(\"script.js is running\");\nconst game = (0,_game__WEBPACK_IMPORTED_MODULE_0__.Game)();\nwindow.game = game;\n\n// Render the boards\n(0,_render__WEBPACK_IMPORTED_MODULE_1__.renderBoard)(\"humanBoard\");\n(0,_render__WEBPACK_IMPORTED_MODULE_1__.renderBoard)(\"computerBoard\");\n\n\n//# sourceURL=webpack:///./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/script.js");
/******/ 	
/******/ })()
;