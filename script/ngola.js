const Plateau = require('./plateau');
const Writer = require('./writer');

class Ngola {

    constructor() {
        this.reset();
    }

    /** Réinitialise le jeu. */
    reset() {
        // Plateau de jeu.
        this.__plateau = new Plateau(this);

        /** Index du joueur courant :
         * 1 pour J1 [blanc],
         * 2 pour J2 [noir]).
         * Pourra être aléatoire dans le futur. */
        this.__joueurCourant = 1;
        //this.premierJoueurAleatoire();

        /** Vainqueur de la partie. */
        this.__vainqueur = null;

        /** Booléen détectant les boucles infinies. */
        this.__boucleInfinie = false;

        this.initialiserBillesPlateau();
        
    }


    // ------------------
    // METHODES PUBLIQUES
    // ------------------


    /** Démarre une partie du jeu. */
    run() {
        Writer.log('Game run.');

        this.test_runAI();
    }

    /** Clone le jeu. */
    clone() {
        let game = new Ngola();

        game.__plateau = this.__plateau.clone(game);
        game.__joueurCourant = this.__joueurCourant;
        game.__vainqueur = this.__vainqueur;
        game.__boucleInfinie = this.__boucleInfinie;

        return game;
    }

    /** Exécute un tour de jeu. */
    play(nomCase) {
        
        if (!this.enJeu) throw new Error("Partie terminée.");

        let c = this.__plateau.getCase(nomCase);
        
        if (c == null) throw new Error("Case inexistante.");
        if (c.joueur != this.__joueurCourant) throw "Case appartenant au joueur adverse.";
        if (!c.peutJouer) throw "La case n'a pas assez de billes pour être jouée.";

        let derniereCaseVide = c;
        let main = this.remplirMain(c);

        /** Variable comptant le nombre de tours de boucles de la main.
         * S'il est trop élevé, alors on est dans une boucle infinie. */
        let endlessLoopTracker = 0;

        // Boucle de la main
        while (main > 0) {
            c = c.caseSuivante;

            if (main == 1) {
                if (c.estVide) {
                    // on dépose la dernière bille dans la case d'après
                    main = this.deposerBille(c.caseSuivante, main);
                }
                else {
                    let captured = false;

                    // On remplit la main
                    main = this.deposerBille(c, main);
                    
                    let capt = this.capture(c, main, captured);
                    
                    main = capt[0];
                    captured = capt[1];

                    if (captured) {
                        c = derniereCaseVide;
                    }
                    else {
                        main = this.remplirMain(c, main);
                        derniereCaseVide = c;
                    }
                }
            }
            else {
                // on enlève 1 de la main
                main = this.deposerBille(c, main);
            }

            // Displays the game board

            /*
            Writer.log('');
            this.__plateau.ascii_light();
            Writer.log('Main :'+main);
            Writer.log('Case : '+c.nom);
            Writer.log('DerniereVide : '+derniereCaseVide.nom);
            */

            endlessLoopTracker++;

            if (endlessLoopTracker >= this.MAX_REPEATS) {
                Writer.log('Boucle infinie.');
                this.__boucleInfinie = true;
                break;
            }
        }

        this.changerJoueurCourant();
        this.actualiserVainqueur();
        
    }

    /** Vérifie si deux états du Ngola sont égaux. */
    equals(ngola) {
        return  (this.__joueurCourant === ngola.__joueurCourant) &&
                (this.__vainqueur === ngola.__vainqueur) &&
                (this.__plateau.equals(ngola.__plateau));
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

    /** Informe si le jeu est toujours en cours ou non. */
    get enJeu() {
        return this.peutJouer && (this.__boucleInfinie === false);
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
        this.initialiserBillesPlateauClassique();
    }

    /** Initialise les billes du plateau de manière aléatoire. */
    initialiserAleatoirement() {
        this.initialiserBillesPlateauAleatoirement(1);
        this.initialiserBillesPlateauAleatoirement(2);
    }

    /** Initialise le nombre de billes du plateau, aléatoirement; par index de joueur. 
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
        for (let i = 0; i < this.NB_BILLES_PAR_JOUEUR; i++) {
            let indexCase = Math.floor((Math.random() * (this.NB_CASES_PAR_JOUEUR-1) + 0));
            listeCases[indexCase].nbBilles++;
        }
        
        // Test
        // Writer.log(listeCases[0].nbBilles);
    }

    initialiserBillesPlateauClassique() {
        let letters = "abcdefgh";

        for (let i = 1; i <= 4; i++) {
            for (let c = 0; c < 8; c++) {
                let char = letters.charAt(c);

                let billes = 0;
                if ((c + i) % 2 == 0) billes = 4;

                this.plateau.getCase(char+i).nbBilles = billes;
            }
        }
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
        if (this.__boucleInfinie === true) {
            this.__vainqueur = null;
        }
        else if (!this.peutJouer) {
            switch(this.__joueurCourant) {
                case 1: this.__vainqueur = 2; break;
                case 2: this.__vainqueur = 1; break;
                default: this.__vainqueur = null;
            }
        }
    }

    /** Décide aléatoirement du premier joueur. */
    premierJoueurAleatoire() {
        this.__joueurCourant = Math.floor((Math.random() * 2) + 1);
    }

    /** Nombre de cases du jeu. */
    get NB_CASES() {
        return 32;
    }

    /** Nombre de cases du jeu, par joueur. */
    get NB_CASES_PAR_JOUEUR() {
        return 16;
    }

    /** Nombre de billes données à chaque joueur en début de partie. */
    get NB_BILLES_PAR_JOUEUR() {
        return 32;
    }

    /** Nombre de boucles de la main pour laquelle le programme va arrêter d'exécuter le tour du joueur. */
    get MAX_REPEATS() {
        return 100000;
    }

    /** Accesseur du plateau. */
    get plateau() {
        return this.__plateau;
    }
    
    /** -----
     *  TESTS
     *  ----- */

    /** Test des cases suivantes. */
    test_plateau_caseSuivante() {
        // On parcourt le chemin
        let currentCase = this.__plateau.getCase('g4');

        for (let i = 0; i < 100; i++) {
            Writer.log(currentCase.nom);
            currentCase = currentCase.caseSuivante;
        }
    }

    /** Test des liens entre les cases (attaquées // liées) */
    test_plateau_caseLiens() {
        let currentCase = this.__plateau.getCase('e2');

        Writer.log('Case : '+currentCase.nom);

        if (currentCase.caseAttaquer != null) {
            Writer.log('Case a attaquer : '+currentCase.caseAttaquer.nom);
        }
        else {
            Writer.log('Case a attaquer : null');
        }

        Writer.log('Case liee : '+currentCase.caseLiee.nom);
    }

    /** Test du clonage d'un plateau. */
    test_clone() {
        this.play(this.listeLegalMoves[0]);
        Writer.log('');
        this.__plateau.ascii_light();

        let copy = this.clone();
        Writer.log('');
        copy.plateau.ascii_light();
    }

}

module.exports.Ngola = Ngola;