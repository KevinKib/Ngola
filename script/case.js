class Case {

    constructor(plateau, nom) {

        // Plateau de jeu.
        this.__plateau = plateau;

        // Nom de la case
        this.__nom = nom;

        // Colonne de la case
        this.__colonne = nom.charAt(0);

        // Ligne de la case
        this.__ligne = nom.charAt(1);

        // Joueur à laquelle appartient la case
        if (this.__ligne == 1 || this.__ligne == 2) {
            this.__joueur = 1;
        }
        else {
            this.__joueur = 2;
        }

        // Nombre de billes sur la case
        this.__nbBilles = 2;

        // Case suivante
        this.__caseSuivante = null;

        // Case qui pourra être attaquée par cette case
        this.__caseAttaquer = null;

        // Case qui est liée à cette case : qui sera attaquée en même temps
        this.__caseLiee = null;

    }

    set caseSuivante(caseSuivante) {
        this.__caseSuivante = caseSuivante;
    }

    get caseSuivante() {
        return this.__caseSuivante;
    }

    set caseAttaquer(caseAttaquer) {
        this.__caseAttaquer = caseAttaquer;
    }

    get caseAttaquer() {
        return this.__caseAttaquer;
    }

    set caseLiee(caseLiee) {
        this.__caseLiee = caseLiee;
    }

    get caseLiees() {
        return this.__caseLiee;
    }

    get nom() {
        return this.__nom;
    }

    get joueur() {
        return this.__joueur;
    }
    
    set nbBilles(nb) {
        this.__nbBilles = nb;
    }

    get nbBilles() {
        return this.__nbBilles;
    }

    get estVide() {
        return this.__nbBilles == 0;
    }

    get peutJouer() {
        return this.__nbBilles > 1;
    }

}

module.exports.Case = Case;