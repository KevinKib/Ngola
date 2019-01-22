class AI {

    constructor(angola) {
        this.__angola = angola;
    }

    /** Thinks and returns a move. */
    play() {
        let randomIndex = Math.floor(Math.random() * this.__angola.listeLegalMoves.length);
        return this.__angola.listeLegalMoves[randomIndex];
    }

}

module.exports.AI = AI;