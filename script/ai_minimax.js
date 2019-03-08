class AI_Minimax {

    constructor(angola) {
        this.__angola = angola;
    }

    /** Thinks and returns a move. */
    play() {
        let randomIndex = Math.floor(Math.random() * this.__angola.listeLegalMoves.length);
        return this.__angola.listeLegalMoves[randomIndex];
    }

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

    evaluation(angola) {
        let res = angola.etatZeroSum;
        if (res == null) res = 0;

        return res;
    }

}

module.exports = AI_Minimax;