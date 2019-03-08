const Case = require('./case').Case;

class Plateau {

    constructor(angola) {

        // Jeu
        this.__angola = angola;
        
        // Liste des cases du plateau
        this.__listeCases = [];
   
        this.initialisationPlateau();
    }

    /** Clone le plateau. */
    clone(angola) {
        let self = this;
        let plateau = new Plateau(angola);

        plateau.__listeCases.forEach(function(c) {
            c.nbBilles = self.getCase(c.nom).nbBilles;
        });

        return plateau;
    }

    /** Ajoute toutes les cases du plateau, avec leur nom, et initialise leur liens avec
     * leurs cases suivantes, leurs cases d'attaque, et leurs cases liées.
     */
    initialisationPlateau() {
        let str = 'abcdefgh';
        
        // Ajout de toutes les cases du plateau, avec leur nom
        for (let indexCol = 1; indexCol <= 8; indexCol++) {
            for (let line = 1; line <= 4; line++) {
                
                let col = str.charAt(indexCol-1);
                let nom = col+line;

                let currentCase = new Case(this, nom);
                this.__listeCases.push(currentCase);
            }
        }

        // Définition des cases suivantes

        // Droite -> gauche
        for (let indexCol = 1; indexCol <= 8; indexCol++) {
            
            let col_1 = str.charAt(indexCol-1);
            let col_2 = str.charAt(indexCol);


            // Si lettre différente de H
            if (indexCol != 8) {
                this.getCase(col_1+'2').caseSuivante = this.getCase(col_2+'2');
                this.getCase(col_1+'4').caseSuivante = this.getCase(col_2+'4');
            }
            else {
                this.getCase(col_1+'2').caseSuivante = this.getCase(col_1+'1');
                this.getCase(col_1+'4').caseSuivante = this.getCase(col_1+'3');
            }

        }

        // Gauche -> droite
        for (let indexCol = 8; indexCol >= 1; indexCol--) {
            
            let col_1 = str.charAt(indexCol-1);
            let col_2 = str.charAt(indexCol-2);

            // Si lettre différente de A
            if (indexCol != 1) {
                this.getCase(col_1+'1').caseSuivante = this.getCase(col_2+'1');
                this.getCase(col_1+'3').caseSuivante = this.getCase(col_2+'3');
            }
            else {
                this.getCase(col_1+'1').caseSuivante = this.getCase(col_1+'2');
                this.getCase(col_1+'3').caseSuivante = this.getCase(col_1+'4');
            }

        }

        // Définition des cases à attaquer et des cases liées
        for (let indexCol = 1; indexCol <= 8; indexCol++) {
            let col = str.charAt(indexCol-1);

            this.getCase(col+'2').caseAttaquer = this.getCase(col+'3');
            this.getCase(col+'3').caseAttaquer = this.getCase(col+'2');

            this.getCase(col+'1').caseLiee = this.getCase(col+'2');
            this.getCase(col+'2').caseLiee = this.getCase(col+'1');
            this.getCase(col+'3').caseLiee = this.getCase(col+'4');
            this.getCase(col+'4').caseLiee = this.getCase(col+'3');
        }
    }

    /** Retourne une case du plateau, en passant son nom en paramètre.
     * @param {*} nom Nom de la case.
     */
    getCase(nom) {
        
        let res = null;

        this.__listeCases.forEach(function(c) {
            if (c.nom == nom) {
                res = c;

                // break ?
            }
        })

        return res;
    }

    /** Retourne la liste des cases appartenant à un joueur précis. */
    getListeCases(indexJoueur) {

        let listeCasesJoueur = [];

        this.__listeCases.forEach(function(c) {

            if (c.joueur == indexJoueur) {
                listeCasesJoueur.push(c);
            }

        })

        return listeCasesJoueur;
    }

    /** Affiche le plateau sous un visuel console. */
    ascii() {
        console.log('---------------------------------');
        let str = 'abcdefgh';
        for (let line = 1; line <= 4; line++) {
            process.stdout.write('| ');
            for (let indexCol = 1; indexCol <= 8; indexCol++) {
                
                let col = str.charAt(indexCol-1);
                let nom = col+line;

                let c = this.getCase(nom);
                process.stdout.write(c.nbBilles + ' | ');
            }
            console.log('\n---------------------------------');
        }
    }

    /** Affiche le plateau sous un visuel console, qui est simplifié. */
    ascii_light() {
        let str = 'abcdefgh';
        for (let line = 1; line <= 4; line++) {
            for (let indexCol = 1; indexCol <= 8; indexCol++) {
                
                let col = str.charAt(indexCol-1);
                let nom = col+line;

                let c = this.getCase(nom);
                process.stdout.write(c.nbBilles+' ');
            }
            console.log('');
        }
    }
 
}

module.exports.Plateau = Plateau;
