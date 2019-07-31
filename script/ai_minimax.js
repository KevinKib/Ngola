const Writer = require('./writer');
const AI = require('./ai');

class AI_Minimax extends AI {

    constructor(ngola, depth) {
        super(ngola);
        this.__depth = depth;

        // Statistics
        this.nbLegalMoves = 0;
        this.nbTours = 0;
    }

    /** Thinks and returns a move. */
    play() {
        this.nbTours++;

        let childNodes = this.__ngola.listeLegalMoves;
        let bestChild = null;
        let bestEval = null;

        let maximizingPlayer = (this.__ngola.joueurCourant == 1);

        for(let child of childNodes) {
            this.nbLegalMoves++;

            let ngolaCopy = this.__ngola.clone();
            ngolaCopy.play(child);

            let evaluation = this.minimax(ngolaCopy, this.__depth, this.worstEvalValue, this.bestEvalValue, maximizingPlayer);
            
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
    minimax(ngola, depth, alpha, beta, maximizingPlayer) {
        let res = null;
        
        if (depth == 0 || !ngola.enJeu) {
            // heuristique
            let color;
            if (maximizingPlayer) {
                color = 1;
            }
            else {
                color = -1;
            }

            res = this.evaluation(ngola) * color;
        }
        else {
            const childNodes = ngola.listeLegalMoves;
            // Reorder child nodes
            let value = this.worstEvalValue;

            for(let child of childNodes) {

                let ngolaCopy = ngola.clone();
                ngolaCopy.play(child);

                value = Math.max(value, -this.minimax(ngolaCopy, depth-1, -beta, -alpha, !maximizingPlayer));

                
                let space = "";
                for (let i = 0; i < this.__depth; i++) {
                    space += '  ';
                }
                for (let i = 0; i < depth; i++) {
                    space = space.substring(0, space.length-2);
                }
                
                Writer.log(space+depth+' | '+child+' : '+value);
                
                

                alpha = Math.max(alpha, value);
                if (alpha >= beta) {
                    break;
                }
            }

            res = value;
        }

        return res;
    }

    /** Evalue une position donnée du jeu Ngola. */
    evaluation(ngola) {
        let res = 0;

        let nbBilles_J1 = 0;
        let nbBilles_J2 = 0;

        for (let c of ngola.plateau.getListeCases(1)) {
            nbBilles_J1 += c.nbBilles;
        }
        for (let c of ngola.plateau.getListeCases(2)) {
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