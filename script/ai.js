class AI {

    constructor(ngola) {
        this.__ngola = ngola;
    }

    /** Thinks and returns a move. */
    play() {
        let randomIndex = Math.floor(Math.random() * this.__ngola.listeLegalMoves.length);
        return this.__ngola.listeLegalMoves[randomIndex];
    }

}

module.exports = AI;