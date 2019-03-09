const Writer = require('./writer');

class AI_Minimax {

    constructor(angola) {
        this.__angola = angola;
        this.__depth = 1;
    }

    /** Thinks and returns a move. */
    play() {
        let childNodes = this.__angola.listeLegalMoves;
        let bestChild = null;
        let bestEval = null;

        let maximizingPlayer = (this.__angola.joueurCourant == 1);

        for(let child of childNodes) {

            let angolaCopy = this.__angola.clone();
            angolaCopy.play(child);

            let evaluation = this.minimax(angolaCopy, this.__depth, -this.worstEvalValue, this.bestEvalValue, maximizingPlayer);
            if (bestChild == null || evaluation > bestEval) {
                bestChild = child;
                bestEval = evaluation;
            }
        }

        return bestChild;
    }

    /** Applique l'algorithme Minimax a partir d'un coup;
     * renvoie une évaluation globale. */
    minimax(angola, depth, alpha, beta, maximizingPlayer) {
        let res = null;
        
        if (depth == 0 || angola.etatZeroSum != null) {
            // heuristique
            let color;
            if (maximizingPlayer) {
                color = 1;
            }
            else {
                color = -1;
            }

            res = this.evaluation(angola) * color;
        }
        else {
            let value = -this.worstEvalValue;

            const childNodes = angola.listeLegalMoves;
            // Reorder child nodes

            for(let child in childNodes) {

                let angolaCopy = this.__angola.clone();
                angolaCopy.play(child);

                value = Math.max(value, -this.minimax(angolaCopy, depth-1, -beta, -alpha, !maximizingPlayer));
                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }

            res = value;
        }

        return res;
    }

    /** Evalue une position donnée du jeu Angola. */
    evaluation(angola) {
        let res = 0;

        for (let c of angola.listeLegalMoves) {
            
        }

        return res;
    }

    /** Retourne la profondeur de réflexion du programme. */
    get depth() {
        return this.__depth;
    }

    /** Renvoie la meilleure valeur d'évaluation possible. */
    get bestEvalValue() {
        return 1000;
    }

    /** Renvoie la pire valeur d'évaluation possible. */
    get worstEvalValue() {
        return -1000;
    }

}

module.exports = AI_Minimax;