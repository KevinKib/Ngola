const Writer = require('./writer');

class AI_Minimax {

    constructor(angola, depth) {
        this.__angola = angola;
        this.__depth = depth;
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
            
            Writer.log('Evaluation of '+child+' : '+evaluation);
            if (bestChild == null || evaluation > bestEval) {
                bestChild = child;
                bestEval = evaluation;
            }
        }

        Writer.log('Move played : '+bestChild+'\n');
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
            const childNodes = angola.listeLegalMoves;
            // Reorder child nodes
            let value = -this.worstEvalValue;

            for(let child of childNodes) {

                let angolaCopy = angola.clone();
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

        let nbBilles_J1 = 0;
        let nbBilles_J2 = 0;

        for (let c of angola.plateau.getListeCases(1)) {
            nbBilles_J1 += c.nbBilles;
        }
        for (let c of angola.plateau.getListeCases(2)) {
            nbBilles_J2 += c.nbBilles;
        }

        res = nbBilles_J1 - nbBilles_J2;

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