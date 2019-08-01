class Evaluation {

    constructor(ngola) {
        this.ngola = ngola;
    }

    gameState() {
        let res = 0;

        if (this.ngola.etatZeroSum == 1) res = 1000;
        else if (this.ngola.etatZeroSum == -1) res = -1000;

        return res;
    }

    nbBilles() {
        let res = 0;

        let nbBilles_J1 = 0;
        let nbBilles_J2 = 0;

        for (let c of this.ngola.plateau.getListeCases(1)) {
            nbBilles_J1 += c.nbBilles;
        }
        for (let c of this.ngola.plateau.getListeCases(2)) {
            nbBilles_J2 += c.nbBilles;
        }

        res = nbBilles_J1 - nbBilles_J2;

        return res;
    }

    nbLegalMoves() {

    }

}

module.exports = Evaluation;