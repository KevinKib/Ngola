const Plateau = require('./plateau').Plateau;
const AI = require('./ai').AI;

class Angola {

    constructor() {
        // Plateau de jeu.
        this.__plateau = new Plateau(this);

        /** Index du joueur courant :
         * 1 pour J1 [blanc],
         * 2 pour J2 [noir]).
         * Pourra être aléatoire dans le futur. */
        this.__joueurCourant = 1;

        this.__vainqueur = null;
    }


    // ------------------
    // METHODES PUBLIQUES
    // ------------------


    /** Démarre une partie du jeu. */
    run() {
        console.log('Game run.');
        this.initialiserBillesPlateau();


        let randomAI = new AI(this);
        let i = 0;
        while(this.peutJouer && i <= 100) {
            this.play(randomAI.play());
            this.__plateau.ascii_light();
            console.log('');
            i++;
        }
        this.actualiserVainqueur();

        switch(this.etatZeroSum) {
            case 1: console.log('Joueur 1 gagne.'); break;
            case 0: console.log('Match nul.'); break;
            case -1: console.log('Joueur 2 gagne.'); break;
            default: console.log('Erreur ?');
        }
    }

    /** Exécute un tour de jeu. */
    play(nomCase) {
        
        let c = this.__plateau.getCase(nomCase);
        
        if (c == null) throw "Case inexistante.";
        if (c.joueur != this.__joueurCourant) throw "Case appartenant au joueur adverse.";
        if (!c.peutJouer) throw "La case n'a pas assez de billes pour être jouée.";

        let derniereCaseVide = c;
        let main = this.remplirMain(c);

        while (main > 0) {
            c = c.caseSuivante;

            //console.log('Main : '+main);

            if (main == 1) {
                if (c.estVide) {
                    // on dépose la dernière bille dans la case d'après
                    main = this.deposerBille(c.caseSuivante, main);
                }
                else {
                    let captured = false;

                    // on remplit la main
                    main = this.deposerBille(c, main);
                    
                    let capt = this.capture(c, main, captured);
                    
                    main = capt[0];
                    captured = capt[1];

                    if (captured) {
                        c = derniereCaseVide;
                        console.log("capture main : "+main);

                        console.log('');
                        this.__plateau.ascii_light();
                        console.log('');
                    }
                    else {
                        main = this.remplirMain(c, main);
                    }
                }
            }
            else {
                // on enlève 1 de la main
                main = this.deposerBille(c, main);
            }
        }

        this.changerJoueurCourant();
    }

    /** Renvoie une liste de tous les mouvements légaux à ce stade de la partie. */
    get listeLegalMoves() {
        let listeCases = this.__plateau.getListeCases(this.__joueurCourant);
        let listeLegalMoves = [];

        listeCases.forEach(function(c) {
            if (c.peutJouer) {
                listeLegalMoves.push(c.nom);
            }
        });

        return listeLegalMoves;
    }

    /** Renvoie true si le joueur courant possède encore des cases légales. */
    get peutJouer() {
        return this.listeLegalMoves.length > 0;
    }

    /** Etat de la partie.
     * Renvoie 1 si le joueur 1 a gagné,
     * 2 si le joueur 2 a gagné,
     * null si la partie est en cours,
     * 0 si la partie est en match nul. 
     */
    get etat() {
        return this.__vainqueur;
    }

    /** Etat de la partie, vis à vis d'un jeu à somme nulle. */
    get etatZeroSum() {
        let res = null;
        switch(this.__vainqueur) {
            case 1: res = 1;  break;
            case 2: res = -1; break;
            case 0: res = 0;  break;
            default: res = null;
        }
        return res;
    }

    /** Retourne le joueur courant. */
    get joueurCourant() {
        return this.__joueurCourant;
    }


    // ----------------
    // METHODES PRIVEES
    // ----------------


    /** Initialise le nombre de billes du plateau. */
    initialiserBillesPlateau() {
        this.initialiserBillesPlateauAleatoirement(1);
        this.initialiserBillesPlateauAleatoirement(2);
    }

    /** Initialise le nombre de billes du plateau, aléatoirement. 
     * 32 billes. On place toutes les cases du plateau dans une liste, on remet le nombre de billes à zéro,
     * et on place aléatoirement chaque bille dans une de ces cases.
     */
    initialiserBillesPlateauAleatoirement(indexJoueur) {

        let listeCases = this.__plateau.getListeCases(indexJoueur);

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

    /** Tente de capturer les billes ennemies sur la même colonne. */
    capture(c, main, captured) {
        
        if (c.caseAttaquer != null) {
            if (!c.caseAttaquer.estVide && !c.caseAttaquer.caseLiee.estVide) {
                main += c.caseAttaquer.nbBilles;
                main += c.caseAttaquer.caseLiee.nbBilles;
    
                c.caseAttaquer.vider();
                c.caseAttaquer.caseLiee.vider();

                captured = true;
            }
        }
        
        return [main, captured];
    }

    /** Dépose une bille de la main dans une case */
    deposerBille(c, main) {
        if (main == 0) throw "Main vide";

        c.nbBilles++;
        main = main-1;
        return main;
    }

    /** Remplit la main du joueur avec les cases de la bille. */
    remplirMain(c) {
        let main = c.nbBilles;
        c.nbBilles = 0;
        return main;
    }

    /** Change le joueur courant à la fin d'un tour. */
    changerJoueurCourant() {
        if (this.__joueurCourant == 1) {
            this.__joueurCourant = 2;
        }
        else {
            this.__joueurCourant = 1;
        }
    }

    /** Met a jour le vainqueur de la partie (l'état du jeu). */
    actualiserVainqueur() {
        if (!this.peutJouer) {
            switch(this.__joueurCourant) {
                case 1: this.__vainqueur = 2;break;
                case 2: this.__vainqueur = 1; break;
                default: this.__vainqueur = null;
            }
        }
    }

    /** Nombre de cases du jeu. */
    get NB_CASES() {
        return 32;
    }

    /** Nombre de cases du jeu, par joueur. */
    get NB_CASES_PAR_JOUEUR() {
        return 16;
    }

    /** Test des cases suivantes. */
    test_plateau_caseSuivante() {
        // On parcourt le chemin
        let currentCase = this.__plateau.getCase('g4');

        for (let i = 0; i < 100; i++) {
            console.log(currentCase.nom);
            currentCase = currentCase.caseSuivante;
        }
    }

    /** Test des liens entre les cases (attaquées // liées) */
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

    /** Test du jeu. */
    test_run1() {
        this.__plateau.ascii_light();
        console.log('');
        this.play('a2');
        console.log('');
        this.__plateau.ascii_light();
    }

}

module.exports.Angola = Angola;