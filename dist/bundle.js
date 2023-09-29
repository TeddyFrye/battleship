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

eval("function Ship(length) {\n  let hitCount = 0;\n\n  function hit() {\n    if (hitCount < length) hitCount++;\n    console.log(\"Direct hit! Coordinates: ({x}, {y})\");\n  }\n\n  function isSunk() {\n    return hitCount >= length;\n  }\n\n  function getHitCount() {\n    return hitCount;\n  }\n\n  return { length, hit, isSunk, getHitCount };\n}\n\nfunction Gameboard() {\n  let ships = [];\n  let missedAttacks = [];\n\n  const placeShip = (coordinates) => {\n    let ship = Ship(coordinates.length);\n    ship.coordinates = coordinates;\n    ships.push(ship);\n  };\n\n  const receiveAttack = (x, y) => {\n    let hit = false;\n    ships.forEach((ship) => {\n      ship.coordinates.forEach((coord) => {\n        if (coord.x === x && coord.y === y) {\n          ship.hit();\n          hit = true;\n          console.log(\"Hit!\");\n        }\n      });\n    });\n    if (!hit) missedAttacks.push({ x, y });\n    console.log(\"Missed!\");\n  };\n\n  const getMissedAttacks = () => {\n    return missedAttacks;\n  };\n\n  const allShipsSunk = () => {\n    return ships.every((ship) => ship.isSunk());\n  };\n\n  const printBoard = () => {\n    let board = Array(10)\n      .fill(\".\")\n      .map(() => Array(10).fill(\".\"));\n    missedAttacks.forEach(({ x, y }) => {\n      board[x][y] = \"O\";\n    });\n\n    ships.forEach((ship) => {\n      ship.coordinates.forEach(({ x, y }) => {\n        board[x][y] = ship.isSunk() ? \"X\" : \"S\";\n      });\n    });\n\n    console.log(board.map((row) => row.join(\" \")).join(\"\\n\"));\n  };\n\n  return {\n    placeShip,\n    receiveAttack,\n    allShipsSunk,\n    printBoard,\n    ships,\n    getMissedAttacks,\n  };\n}\n\nfunction Player(name, gameboard, isComputer = false) {\n  const moves = [];\n\n  const attack = (x, y) => {\n    gameboard.receiveAttack(x, y);\n    moves.push({ x, y });\n    console.log(`${name} attacked ${x}, ${y}.`);\n  };\n\n  const computerMove = () => {\n    let x, y;\n    do {\n      x = Math.floor(Math.random() * 10);\n      y = Math.floor(Math.random() * 10);\n    } while (moves.some((move) => move.x === x && move.y === y));\n    attack(x, y);\n  };\n\n  return { name, attack, isComputer, computerMove, moves };\n}\n\nfunction placePlayerShips(gameboard) {\n  const isOccupied = (x, y, ships) => {\n    return ships.some((ship) =>\n      ship.coordinates.some((coord) => coord.x === x && coord.y === y)\n    );\n  };\n\n  const isValidCoordinate = (x, y) => {\n    return x >= 0 && x < 10 && y >= 0 && y < 10;\n  };\n\n  let numberOfShips = 3; // or any number you prefer\n  for (let i = 0; i < numberOfShips; i++) {\n    let isValid = false;\n    while (!isValid) {\n      let x = parseInt(prompt(`Enter the x coordinate for ship ${i + 1}:`));\n      let y = parseInt(prompt(`Enter the y coordinate for ship ${i + 1}:`));\n\n      if (!isValidCoordinate(x, y)) {\n        alert(\"Invalid coordinates! Please enter coordinates between 0 and 9.\");\n      } else if (isOccupied(x, y, gameboard.ships)) {\n        alert(\n          \"Coordinates are already occupied! Please enter different coordinates.\"\n        );\n      } else {\n        gameboard.placeShip([{ x, y }]);\n        isValid = true;\n      }\n    }\n  }\n}\n\nfunction placeComputerShips(gameboard) {\n  const isOccupied = (x, y, ships) => {\n    return ships.some((ship) =>\n      ship.coordinates.some((coord) => coord.x === x && coord.y === y)\n    );\n  };\n\n  const isValidCoordinate = (x, y) => {\n    return x >= 0 && x < 10 && y >= 0 && y < 10;\n  };\n\n  let numberOfShips = 3;\n  for (let i = 0; i < numberOfShips; i++) {\n    let isValid = false;\n    while (!isValid) {\n      let x = Math.floor(Math.random() * 10);\n      let y = Math.floor(Math.random() * 10);\n\n      if (!isValidCoordinate(x, y)) {\n        console.error(\"Invalid coordinates! Computer made a mistake.\");\n      } else if (isOccupied(x, y, gameboard.ships)) {\n        console.error(\n          \"Coordinates are already occupied! Computer made a mistake.\"\n        );\n      } else {\n        gameboard.placeShip([{ x, y }]);\n        isValid = true;\n      }\n    }\n  }\n}\n\nconst playerBoard = Gameboard();\nconst computerBoard = Gameboard();\nconst player = Player(\"Player\", computerBoard);\nconst computer = Player(\"Computer\", playerBoard, true);\n\nconst gameLoop = () => {\n  placePlayerShips(playerBoard);\n  placeComputerShips(computerBoard);\n  let gameOn = true;\n  let rounds = 0;\n  const maxRounds = 30;\n  while (gameOn) {\n    if (rounds >= maxRounds) {\n      console.log(\"Game Over! Too many rounds!\");\n    }\n    playerBoard.printBoard();\n    computerBoard.printBoard();\n\n    let x = prompt(\"Enter the x coordinate:\");\n    let y = prompt(\"Enter the y coordinate:\");\n\n    x = parseInt(x);\n    y = parseInt(y);\n\n    player.attack(x, y);\n    computer.computerMove();\n    rounds++;\n\n    if (playerBoard.allShipsSunk() || computerBoard.allShipsSunk()) {\n      gameOn = false;\n      alert(\"Game Over!\");\n    }\n  }\n};\n\n// export functions for test.js\nmodule.exports.gameLoop = gameLoop;\nmodule.exports.Ship = Ship;\nmodule.exports.Gameboard = Gameboard;\nmodule.exports.Player = Player;\nmodule.exports.playerBoard = playerBoard;\n\n\n//# sourceURL=webpack:///./src/game.js?");

/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ \"./src/game.js\");\n\n\nwindow.gameLoop = _game__WEBPACK_IMPORTED_MODULE_0__.gameLoop;\nwindow.Ship = _game__WEBPACK_IMPORTED_MODULE_0__.Ship;\nwindow.Gameboard = _game__WEBPACK_IMPORTED_MODULE_0__.Gameboard;\nwindow.Player = _game__WEBPACK_IMPORTED_MODULE_0__.Player;\n\nconsole.log(\"yo\");\n\n// gameLoop();\n\n\n//# sourceURL=webpack:///./src/script.js?");

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