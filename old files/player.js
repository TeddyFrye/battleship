function Player(name, gameboard, isComputer = false) {
  const moves = [];

  const attack = (x, y) => {
    if (isMoveValid(x, y)) {
      gameboard.receiveAttack(x, y);
      moves.push({ x, y });
      console.log(`${name} attacked ${x}, ${y}.`);
    }
  };

  const isMoveValid = (x, y) => {
    return !moves.some((move) => move.x === x && move.y === y);
  };

  const computerMove = () => {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (!isMoveValid(x, y));

    attack(x, y);
    console.log(`The Computer attacked ${x}, ${y}.`);
  };

  return { name, attack, isComputer, computerMove, moves };
}
