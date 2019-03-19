let Ngola = require('./ngola').Ngola;

class AI {

    constructor(ngola) {
        this.__ngola = ngola;
    }

    /** Thinks and returns a move. */
    play() {
        let randomIndex = Math.floor(Math.random() * this.__ngola.listeLegalMoves.length);
        return this.__ngola.listeLegalMoves[randomIndex];
    }
    
    /** Inits one side of the board. */
    initBoard(index) {
        let ngolaCopy = new Ngola();
        ngolaCopy.initialiserAleatoirementIndex(index);
        return ngolaCopy.plateau.getListeCases(index);
    }

}

module.exports = AI;