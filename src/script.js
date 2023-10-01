import {
  gameStart,
  gameStep,
  playerBoard,
  computerBoard,
  player,
  computer,
} from "./game";

window.gameStart = gameStart;
window.gameStep = gameStep;
window.playerBoard = playerBoard;
window.computerBoard = computerBoard;
window.player = player;
window.computer = computer;

window.gameStart();
