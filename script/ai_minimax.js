class AI_Minimax {

    constructor(angola) {
        this.__angola = angola;
        this.__depth = 0;
    }

    /** Thinks and returns a move. */
    play() {
        let childNodes = this.__angola.listeLegalMoves;
        let bestChild = null;
        let bestEval = null;

        // maximizing or minimizing player
        let maximizingPlayer = this.__angola.joueurCourant == 1;


        for(let child of childNodes) {

            let angolaCopy = this.__angola.clone();
            angolaCopy.play(child);

            let evaluation = this.minimax(angolaCopy, this.__depth, -10000, 10000, maximizingPlayer);
            if (bestChild == null || evaluation > bestEval) {
                bestChild = child;
                bestEval = evaluation;
            }
        }
        
        return bestChild;
    }

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
            let value = -10000;

            const childNodes = angola.listeLegalMoves;
            // Reorder child nodes

            for(let i = 0; i < childNodes.length; i++) {
                let child = childNodes[i];

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

    evaluation(angola) {
        let res = angola.etatZeroSum;
        if (res == null) res = 0;

        if (res != 0) {
            console.log('eval : '+res);
        }

        return res;
    }

}

module.exports.AI_Minimax = AI_Minimax;