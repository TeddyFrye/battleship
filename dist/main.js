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

eval("const BOARD_SIZE = 3;\n\nfunction Coordinate(x, y) {\n  function sameRow(other) {\n    return y === other.y;\n  }\n\n  function sameColumn(other) {\n    return x === other.x;\n  }\n\n  function equals(other) {\n    return sameRow(other) && sameColumn(other);\n  }\n\n  return { x, y, sameRow, sameColumn, equals };\n}\n\nfunction Ship(start, end) {\n  if (!start || !end) {\n    console.error(\"Invalid coordinates for Ship.\");\n    return null;\n  }\n\n  if (!start.sameRow(end) && !start.sameColumn(end)) {\n    console.error(\n      \"Invalid ship placement: Start and End coordinates are neither in the same row nor column.\"\n    );\n    return null;\n  }\n\n  const coordinates = [];\n\n  function makeCoords(start, end) {\n    const minX = Math.min(start.x, end.x);\n    const maxX = Math.max(start.x, end.x);\n    const minY = Math.min(start.y, end.y);\n    const maxY = Math.max(start.y, end.y);\n\n    for (let x = minX; x <= maxX; x++) {\n      for (let y = minY; y <= maxY; y++) {\n        coordinates.push(Coordinate(x, y));\n      }\n    }\n  }\n\n  makeCoords(start, end);\n\n  const length = coordinates.length;\n  const hits = [];\n\n  function hit(coordinate) {\n    // Check if the coordinate is part of the ship and hasn't been hit yet\n    const target = coordinates.find((coord) => coord.equals(coordinate));\n    const alreadyHit = hits.some((hit) => hit.equals(coordinate));\n\n    if (target && !alreadyHit) {\n      hits.push(target);\n    }\n  }\n\n  function isSunk() {\n    return hits.length >= length;\n  }\n\n  return { coordinates, hit, hits, isSunk };\n}\n\nfunction Gameboard() {\n  const size = BOARD_SIZE;\n  let ships = [];\n  let missedAttacks = [];\n\n  const isValidCoordinate = (coordinate) => {\n    const { x, y } = coordinate;\n    return x >= 0 && x < size && y >= 0 && y < size;\n  };\n\n  const isOccupied = (coordinate) => {\n    return getShipIfOccupied(coordinate) !== false;\n  };\n\n  const getShipIfOccupied = (coordinate) => {\n    const foundShip = ships.find((ship) =>\n      ship.coordinates.some((shipCoordinate) =>\n        shipCoordinate.equals(coordinate)\n      )\n    );\n    return foundShip || false;\n  };\n\n  const placeShip = (ship) => {\n    let canPlace = true;\n\n    ship.coordinates.forEach((coordinate) => {\n      if (!isValidPlacement(coordinate)) {\n        canPlace = false;\n      }\n    });\n\n    if (canPlace) {\n      ships.push(ship);\n      return true;\n    }\n\n    return false;\n  };\n\n  function isValidPlacement(target) {\n    return isValidCoordinate(target) && !isOccupied(target);\n  }\n\n  const receiveAttack = (target) => {\n    // Check if this coordinate has already been attacked\n    const alreadyAttacked =\n      missedAttacks.some((miss) => miss.equals(target)) ||\n      ships.some((ship) => ship.hits.some((hit) => hit.equals(target)));\n\n    if (alreadyAttacked) {\n      console.log(\"Already attacked this coordinate!\");\n      return;\n    }\n\n    const ship = getShipIfOccupied(target);\n    if (ship) {\n      ship.hit(target);\n      console.log(\"Hit!\");\n    } else {\n      missedAttacks.push(target);\n      console.log(\"Missed!\");\n    }\n  };\n\n  const getMissedAttacks = () => {\n    return missedAttacks;\n  };\n\n  const allShipsSunk = () => {\n    return ships.every((ship) => ship.isSunk());\n  };\n\n  const printBoard = (label) => {\n    console.log(`\\n${label}'s board:`);\n    let board = Array(size)\n      .fill(\"▪️\")\n      .map(() => Array(size).fill(\"🔳\"));\n    missedAttacks.forEach(({ x, y }) => {\n      board[y][x] = \"🌊\";\n    });\n\n    ships.forEach((ship) => {\n      ship.coordinates.forEach(({ x, y }) => {\n        board[y][x] = ship.isSunk() ? \"🔥\" : \"🚢\";\n      });\n    });\n\n    console.log(board.map((row) => row.join(\" \")).join(\"\\n\"));\n  };\n\n  const getStatus = () => {\n    // return lost if the player with this board has lost\n    if (allShipsSunk()) {\n      return \"lost\";\n    }\n    return \"playing\";\n  };\n\n  return {\n    placeShip,\n    receiveAttack,\n    allShipsSunk,\n    printBoard,\n    ships,\n    getMissedAttacks,\n    size,\n    getStatus,\n  };\n}\n\nfunction Player(name, gameboard, isComputer = false) {\n  const moves = [];\n\n  const attack = (target) => {\n    logAttack(target);\n    gameboard.receiveAttack(target);\n    moves.push(target);\n  };\n\n  const logAttack = (target) => {\n    const { x, y } = target;\n    console.log(`${name} attacked ${x}, ${y}`);\n  };\n\n  const computerMove = () => {\n    let x, y;\n    let attempts = 0;\n    const maxAttempts = 100_000;\n\n    do {\n      attempts++;\n      x = Math.floor(Math.random() * BOARD_SIZE);\n      y = Math.floor(Math.random() * BOARD_SIZE);\n      target = Coordinate(x, y);\n    } while (\n      moves.some((move) => move.equals(target)) &&\n      attempts < maxAttempts\n    );\n\n    attack(target);\n  };\n\n  return { name, attack, isComputer, computerMove, moves };\n}\n\nfunction placeDefaultShips(gameboard) {\n  gameboard.placeShip(Ship(Coordinate(0, 0), Coordinate(0, 0)));\n  // gameboard.placeShip([{ x: 1, y: 0 }]);\n  // gameboard.placeShip([{ x: 1, y: 2 }]);\n}\n\nconst humanBoard = Gameboard();\nconst computerBoard = Gameboard();\nconst human = Player(\"Human\", computerBoard);\nconst computer = Player(\"Computer\", humanBoard, true);\n\nconst gameStart = () => {\n  placeDefaultShips(humanBoard);\n  placeDefaultShips(computerBoard);\n  humanBoard.printBoard(\"👶\");\n  computerBoard.printBoard(\"🤖\");\n};\n\nconst gameStep = (x, y) => {\n  const target = Coordinate(x, y);\n  human.attack(target);\n  computerBoard.printBoard(\"🤖\");\n  let status = computerBoard.getStatus();\n  if (status === \"lost\") {\n    console.log(\"Human wins!\");\n    return;\n  }\n\n  computer.computerMove();\n  humanBoard.printBoard(\"👶\");\n  status = humanBoard.getStatus();\n  if (status === \"lost\") {\n    console.log(\"Computer wins!\");\n    return;\n  }\n};\n\n// export functions for test.js\nmodule.exports.Coordinate = Coordinate;\nmodule.exports.Ship = Ship;\nmodule.exports.Gameboard = Gameboard;\nmodule.exports.Player = Player;\n\n// exports for console-only version\nmodule.exports.gameStart = gameStart;\nmodule.exports.gameStep = gameStep;\nmodule.exports.humanBoard = humanBoard;\nmodule.exports.computerBoard = computerBoard;\nmodule.exports.human = human;\nmodule.exports.computer = computer;\n\n\n//# sourceURL=webpack:///./src/game.js?");

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