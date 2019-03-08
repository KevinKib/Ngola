class AI_Minimax {

    constructor(angola) {
        this.__angola = angola;
        this.__depth = 1;

        this.__bestEval = 1000;
        this.__worstEval = -1000;
    }

    /** Thinks and returns a move. */
    play() {
        
        for (let move in this.__angola.listeLegalMoves) {
            let angolaClone = this.__angola.clone();
            angolaClone.play(move);

            let evaluation = this.minimax(angolaClone, this.__depth, this.__bestEval, this.__worstEval, true);

        }

        let randomIndex = Math.floor(Math.random() * this.__angola.listeLegalMoves.length);
        return this.__angola.listeLegalMoves[randomIndex];

        
    }

    /** Applique l'algorithme Minimax a partir d'un coup;
     * renvoie une évaluation globale. */
    minimax(angola, depth, alpha, beta, maximizingPlayer) {
        let res = null;
        
        if (depth == 0 || angola.etatZeroSum != null) {
            // heuristique
            let color;
            if (maximizingPlayer) color = 1;
            else color = -1;

            res = this.evaluation(angola) * color;
        }
        else {
            value = -10000;

            let childNodes = angola.listeLegalMoves;
            // Reorder child nodes

            for(let i = 0; i < childNodes.length; i++) {
                let child = childNodes[i];

                value = Math.max(value, -minimax(child, depth-1, -beta, -alpha, -maximizingPlayer));
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
        let res = angola.etatZeroSum;
        if (res == null) res = 0;

        return res;
    }

    /** Retourne la profondeur de réflexion du programme. */
    get depth() {
        return this.__depth;
    }

}

module.exports = AI_Minimax;