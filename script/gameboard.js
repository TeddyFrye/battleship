const Ship = require("./script/ship");

const Gameboard = () => {
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
        }
      });
    });
    if (!hit) missedAttacks.push({ x, y });
  };

  const allShipsSunk = () => {
    return ships.every((ship) => ship.isSunk());
  };

  const getMissedAttacks = () => {
    return missedAttacks;
  };

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    getMissedAttacks,
    ships, // Expose ships for testing
  };
};

module.exports = Gameboard;
