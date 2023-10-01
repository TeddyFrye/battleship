/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((module) => {

eval("const BOARD_SIZE = 3;\n\nfunction Coordinate(x, y) {\n  function sameRow(other) {\n    return y === other.y;\n  }\n\n  function sameColumn(other) {\n    return x === other.x;\n  }\n\n  function equals(other) {\n    return sameRow(other) && sameColumn(other);\n  }\n\n  return { x, y, sameRow, sameColumn, equals };\n}\n\nfunction Ship(start, end) {\n  if (!start || !end) {\n    console.error(\"Invalid coordinates for Ship.\");\n    return null;\n  }\n\n  if (!start.sameRow(end) && !start.sameColumn(end)) {\n    console.error(\n      \"Invalid ship placement: Start and End coordinates are neither in the same row nor column.\"\n    );\n    return null;\n  }\n\n  const coordinates = [];\n\n  function makeCoords(start, end) {\n    const minX = Math.min(start.x, end.x);\n    const maxX = Math.max(start.x, end.x);\n    const minY = Math.min(start.y, end.y);\n    const maxY = Math.max(start.y, end.y);\n\n    for (let x = minX; x <= maxX; x++) {\n      for (let y = minY; y <= maxY; y++) {\n        coordinates.push(Coordinate(x, y));\n      }\n    }\n  }\n\n  makeCoords(start, end);\n\n  const length = coordinates.length;\n  const hits = [];\n\n  function hit(coordinate) {\n    // Check if the coordinate is part of the ship and hasn't been hit yet\n    const target = coordinates.find((coord) => coord.equals(coordinate));\n    const alreadyHit = hits.some((hit) => hit.equals(coordinate));\n\n    if (target && !alreadyHit) {\n      hits.push(target);\n    }\n  }\n\n  function isSunk() {\n    return hits.length >= length;\n  }\n\n  return { coordinates, hit, hits, isSunk };\n}\n\nfunction Gameboard() {\n  const size = BOARD_SIZE;\n  let ships = [];\n  let missedAttacks = [];\n\n  const isValidCoordinate = (x, y) => {\n    return x >= 0 && x < size && y >= 0 && y < size;\n  };\n\n  const isOccupied = (x, y) => {\n    return getShipIfOccupied(x, y) !== false;\n  };\n\n  const getShipIfOccupied = (x, y) => {\n    const foundShip = ships.find((ship) =>\n      ship.coordinates.some((coord) => coord.x === x && coord.y === y)\n    );\n    return foundShip || false;\n  };\n\n  const placeShip = (ship) => {\n    let canPlace = true;\n\n    ship.coordinates.forEach(({ x, y }) => {\n      if (!isValidPlacement(x, y)) {\n        canPlace = false;\n      }\n    });\n\n    if (canPlace) {\n      ships.push(ship);\n      return true;\n    }\n\n    return false;\n  };\n\n  function isValidPlacement(x, y) {\n    return isValidCoordinate(x, y) && !isOccupied(x, y);\n  }\n\n  const receiveAttack = (x, y) => {\n    const coordinate = Coordinate(x, y);\n    // Check if this coordinate has already been attacked\n    const alreadyAttacked =\n      missedAttacks.some((miss) => miss.equals(coordinate)) ||\n      ships.some((ship) => ship.hits.some((hit) => hit.equals(coordinate)));\n\n    if (alreadyAttacked) {\n      console.log(\"Already attacked this coordinate!\");\n      return;\n    }\n\n    const ship = getShipIfOccupied(x, y);\n    if (ship) {\n      ship.hit(coordinate);\n      console.log(\"Hit!\");\n    } else {\n      missedAttacks.push(coordinate);\n      console.log(\"Missed!\");\n    }\n  };\n\n  const getMissedAttacks = () => {\n    return missedAttacks;\n  };\n\n  const allShipsSunk = () => {\n    return ships.every((ship) => ship.isSunk());\n  };\n\n  const printBoard = (label) => {\n    console.log(`\\n${label}'s board:`);\n    let board = Array(size)\n      .fill(\"▪️\")\n      .map(() => Array(size).fill(\"🔳\"));\n    missedAttacks.forEach(({ x, y }) => {\n      board[x][y] = \"🌊\";\n    });\n\n    ships.forEach((ship) => {\n      ship.coordinates.forEach(({ x, y }) => {\n        board[x][y] = ship.isSunk() ? \"🔥\" : \"🚢\";\n      });\n    });\n\n    console.log(board.map((row) => row.join(\" \")).join(\"\\n\"));\n  };\n\n  const getStatus = () => {\n    // return lost if the player with this board has lost\n    if (allShipsSunk()) {\n      return \"lost\";\n    }\n    return \"playing\";\n  };\n\n  return {\n    placeShip,\n    receiveAttack,\n    allShipsSunk,\n    printBoard,\n    ships,\n    getMissedAttacks,\n    size,\n    getStatus,\n  };\n}\n\nfunction Player(name, gameboard, isComputer = false) {\n  const moves = [];\n\n  const attack = (x, y) => {\n    logAttack(x, y);\n    gameboard.receiveAttack(x, y);\n    moves.push({ x, y });\n  };\n\n  const logAttack = (x, y) => {\n    console.log(`${name} attacked ${x}, ${y}`);\n  };\n\n  const computerMove = () => {\n    let x, y;\n\n    do {\n      x = Math.floor(Math.random() * BOARD_SIZE);\n      y = Math.floor(Math.random() * BOARD_SIZE);\n    } while (moves.some((move) => move.x === x && move.y === y));\n    attack(x, y);\n  };\n\n  return { name, attack, isComputer, computerMove, moves };\n}\n\nfunction placeDefaultShips(gameboard) {\n  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));\n  // gameboard.placeShip([{ x: 1, y: 0 }]);\n  // gameboard.placeShip([{ x: 1, y: 2 }]);\n}\n\nfunction placePlayerShips(gameboard) {\n  let numberOfShips = 3; // or any number you prefer\n  for (let i = 0; i < numberOfShips; i++) {\n    let isPlaced = false;\n    while (!isPlaced) {\n      let x = parseInt(prompt(`Enter the x coordinate for ship ${i + 1}:`));\n      let y = parseInt(prompt(`Enter the y coordinate for ship ${i + 1}:`));\n\n      isPlaced = gameboard.placeShip([{ x, y }]);\n\n      if (!isPlaced) {\n        alert(`Error placing ship at ${x}, ${y}. Please try again.`);\n      }\n    }\n  }\n}\n\nfunction placeComputerShips(gameboard) {\n  const isOccupied = (x, y, ships) => {\n    return ships.some((ship) =>\n      ship.coordinates.some((coord) => coord.x === x && coord.y === y)\n    );\n  };\n\n  const isValidCoordinate = (x, y) => {\n    return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;\n  };\n\n  let numberOfShips = 3;\n  for (let i = 0; i < numberOfShips; i++) {\n    let isValid = false;\n    while (!isValid) {\n      let x = Math.floor(Math.random() * BOARD_SIZE);\n      let y = Math.floor(Math.random() * BOARD_SIZE);\n\n      if (!isValidCoordinate(x, y)) {\n        console.error(\"Invalid coordinates! Computer made a mistake.\");\n      } else if (isOccupied(x, y, gameboard.ships)) {\n        console.error(\n          \"Coordinates are already occupied! Computer made a mistake.\"\n        );\n      } else {\n        gameboard.placeShip([{ x, y }]);\n        isValid = true;\n      }\n    }\n  }\n}\n\nconst playerBoard = Gameboard();\nconst computerBoard = Gameboard();\nconst player = Player(\"Player\", computerBoard);\nconst computer = Player(\"Computer\", playerBoard, true);\n\nconst gameStart = () => {\n  placeDefaultShips(playerBoard);\n  placeDefaultShips(computerBoard);\n  playerBoard.printBoard(\"👶\");\n  computerBoard.printBoard(\"🤖\");\n};\n\nconst gameStep = (x, y) => {\n  player.attack(x, y);\n  computerBoard.printBoard(\"🤖\");\n  let status = computerBoard.getStatus();\n  if (status === \"lost\") {\n    console.log(\"Player wins!\");\n    return;\n  }\n\n  computer.computerMove();\n  playerBoard.printBoard(\"👶\");\n  status = playerBoard.getStatus();\n  if (status === \"lost\") {\n    console.log(\"Computer wins!\");\n    return;\n  }\n};\n\n// export functions for test.js\nmodule.exports.Coordinate = Coordinate;\nmodule.exports.Ship = Ship;\nmodule.exports.Gameboard = Gameboard;\nmodule.exports.Player = Player;\n\n// exports for console-only version\nmodule.exports.gameStart = gameStart;\nmodule.exports.gameStep = gameStep;\nmodule.exports.playerBoard = playerBoard;\nmodule.exports.computerBoard = computerBoard;\nmodule.exports.player = player;\nmodule.exports.computer = computer;\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\nwindow.gameStart = _game__WEBPACK_IMPORTED_MODULE_0__.gameStart;\nwindow.gameStep = _game__WEBPACK_IMPORTED_MODULE_0__.gameStep;\nwindow.playerBoard = _game__WEBPACK_IMPORTED_MODULE_0__.playerBoard;\nwindow.computerBoard = _game__WEBPACK_IMPORTED_MODULE_0__.computerBoard;\nwindow.player = _game__WEBPACK_IMPORTED_MODULE_0__.player;\nwindow.computer = _game__WEBPACK_IMPORTED_MODULE_0__.computer;\n\nwindow.gameStart();\n\n\n//# sourceURL=webpack:///./src/script.js?");

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
/******/ 	__webpack_require__("./src/script.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./src/game.js");
/******/ 	
/******/ })()
;