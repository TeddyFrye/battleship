import { Game } from "./game";
import { renderBoard } from "./render";
console.log("script.js is running");
const game = Game();
window.game = game;

// Render the boards
renderBoard("humanBoard");
renderBoard("computerBoard");
