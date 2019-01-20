const Plateau = require('./plateau').Plateau;

class Angola {

    constructor() {
        this.__plateau = new Plateau(this);

    }

    /** Démarre une partie du jeu. */
    run() {
        console.log('Game run.');
        this.initialiserBillesPlateau();
    }

    /** Initialise le nombre de billes du plateau. */
    initialiserBillesPlateau() {
        this.initialiserBillesPlateauAleatoirement();
    }

    /** Initialise le nombre de billes du plateau, aléatoirement. 
     * 32 billes. On place toutes les cases du plateau dans une liste, on remet le nombre de billes à zéro,
     * et on place aléatoirement chaque bille dans une de ces cases.
     */
    initialiserBillesPlateauAleatoirement() {

        let listeCases = this.__plateau.getListeCases(1);

        // Remise à zéro du nombre de billes de chaque case du plateau
        listeCases.forEach(function(c) {
            c.nbBilles = 0;
        })

        // Pour toutes les 32 billes, on place aléatoirement chaque bille dans une des 16 cases du plateau.
        for (let i = 0; i < this.NB_CASES_PAR_JOUEUR; i++) {

            let indexCase = Math.floor((Math.random() * 15) + 0);
            listeCases[indexCase].nbBilles++;

        }

        // Test
        // console.log(listeCases[0].nbBilles);

    }


    // Propriétés read-only
    get NB_CASES_PAR_JOUEUR() {
        return 32;
    }



    // Tests

    test_plateau_caseSuivante() {
        // On parcourt le chemin
        let currentCase = this.__plateau.getCase('g4');

        for (let i = 0; i < 100; i++) {
            console.log(currentCase.nom);
            currentCase = currentCase.caseSuivante;
        }
    }

    test_plateau_caseLiens() {
        let currentCase = this.__plateau.getCase('e2');

        console.log('Case : '+currentCase.nom);

        if (currentCase.caseAttaquer != null) {
            console.log('Case a attaquer : '+currentCase.caseAttaquer.nom);
        }
        else {
            console.log('Case a attaquer : null');
        }

        console.log('Case liee : '+currentCase.caseLiee.nom);
    }

}

module.exports.Angola = Angola;