const Plateau = require('./plateau').Plateau;

class Angola {

    constructor() {
        this.__plateau = new Plateau(this);

        /* Index du joueur courant
            1 pour J1 [blanc],
            2 pour J2 [noir]) 
            Pourra être aléatoire dans le futur */
        this.__joueurCourant = 1;
    }

    /** Démarre une partie du jeu. */
    run() {
        console.log('Game run.');
        this.initialiserBillesPlateau();
        this.__plateau.ascii_light();
        console.log('');
        this.play('e2');
        console.log('');
        this.__plateau.ascii_light();
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
        for (let i = 0; i < this.NB_CASES; i++) {
            let indexCase = Math.floor((Math.random() * 15) + 0);
            listeCases[indexCase].nbBilles++;
        }
        
        // Test
        // console.log(listeCases[0].nbBilles);
    }

    /** Exécute un tour de jeu. */
    play(nomCase) {
        
        let c = this.__plateau.getCase(nomCase);
        
        if (c == null) throw "Case inexistante.";
        if (c.joueur != this.__joueurCourant) throw "Case appartenant au joueur adverse.";
        if (!c.peutJouer) throw "La case n'a pas assez de billes pour être jouée.";
        
        let main = this.remplirMain(c);

        while (main > 0) {
            c = c.caseSuivante;

            console.log(main);

            // la main ne devrait jamais être à 0
            if (main == 1) {
                if (c.estVide) {
                    // on dépose la dernière bille dans la case d'après
                    main = this.deposerBille(c.caseSuivante, main);
                }
                else {
                    // on remplit la main
                    main = this.deposerBille(c, main);
                    main = this.remplirMain(c, main);
                }
            }
            else {
                // on enlève 1 de la main
                main = this.deposerBille(c, main);
            }
        }
    }

    avancerCase() {

    }

    /** Dépose une bille de la main dans une case */
    deposerBille(c, main) {
        if (main == 0) throw "Main vide";

        c.nbBilles++;
        main = main-1;
        return main;
    }

    remplirMain(c) {
        let main = c.nbBilles;
        c.nbBilles = 0;
        return main;
    }

    // Propriétés read-only
    get NB_CASES() {
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