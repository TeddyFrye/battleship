function Player(name, gameboard, isComputer = false){
    const moves = [];

    const attack = (x, y) => {
        if (isMoveValid(x,y) {
            gameboard.receiveAttack(x, y);
            moves.push({ x, y });
        })
    };

    const isMoveValid = (x, y) => {
        return !moves.some((move) => move.x === x && move.y === y);
    };

    const computerMove = () => {
        let x,y;
        do




}